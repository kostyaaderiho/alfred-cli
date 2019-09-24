const didYouMean = require('didyoumean');
const program = require('commander');
const Command = require('./command');
const chalk = require('chalk');

/**
 * Suggest command that is similar to typed command.
 *
 * @param {string} cmd Typed command in CMD.
 */
function suggestCommands(cmd) {
    const availableCommands = program.commands.map(cmd => cmd._name);
    const suggestion = didYouMean(cmd, availableCommands);

    if (suggestion) {
        console.log(
            `  ` + chalk.red(`Did you mean ${chalk.yellow(suggestion)}?`)
        );
    }
}

/**
 * CLI start message.
 *
 * @param {*} commands Available commands list.
 */
function startMessage(commands) {
    let message = `
${chalk.blue(`\nWelcome to Alfred, ladies and gentlemens! \n`)}
Available commands: 
\n`;

    return commands.reduce(
        (accum, current) =>
            (accum += `${chalk.blue(current._name)} ${
                current._alias ? chalk.blue('(' + current._alias + ')') : ''
            }: ${current._description} \n`),
        message
    );
}

/**
 * Run a command.
 *
 * @param {*} workspace Current workspace.
 * @param {*} args Raw CLI arguments.
 */
async function commandRunner({ workspace, args, testEnv }) {
    return new Promise(resolve => {
        /**
         * CLI commands list.
         *
         * NPM "commander" package is used for parsing input args.
         *
         * @see https://www.npmjs.com/package/commander
         */
        program
            .command('init <projectName>')
            .alias('i')
            .description('Initialize your project in <projectName> directory.')
            .option(
                '--skip-install',
                'When true, does not install dependency packages.'
            )
            .option(
                '--skip-prompt',
                'When true, does not prompt project option questions.'
            )
            .action((projectName, options) => {
                let command = new Command({
                    workspace,
                    options: {
                        skipInstall: !!options.skipInstall,
                        skipPrompt: !!options.skipPrompt,
                        schematicName: projectName,
                        force: !!options.force
                    },
                    name: 'init'
                });
                command.validateAndRun().then(resolve);
            });

        program
            .command('generate <shematic> <shematicName>')
            .alias('g')
            .description('Generates files based on a schematic.')
            .action((schematic, schematicName) => {
                let command = new Command({
                    workspace,
                    options: {
                        schematicName,
                        schematic
                    },
                    name: 'generate',
                    testEnv
                });
                command.validateAndRun().then(resolve);
            });

        program
            .command('develop')
            .alias('dev')
            .description('Start local dev server.')
            .option('--port <portNumber>', 'Local dev server port.')
            .option('--proxy <proxyURL>', 'Target proxy URL')
            .action(options => {
                let command = new Command({
                    workspace,
                    options: {
                        proxyOption: options.proxy,
                        port: options.port
                    },
                    name: 'develop'
                });
                command.validateAndRun().then(resolve);
            });

        program
            .command('build')
            .alias('b')
            .description('Compiles the app into an output directory.')
            .action(() => {
                let command = new Command({
                    workspace,
                    name: 'build'
                });
                command.validateAndRun().then(resolve);
            });

        program.arguments('<command>').action(cmd => {
            program.outputHelp();
            console.log();
            console.log(
                `  ` + chalk.red(`Unknown command ${chalk.yellow(cmd)}.`)
            );
            console.log();
            suggestCommands(cmd);
        });

        program
            .command('info')
            .description('Print debugging information about your environment.')
            .action(() => {
                console.log(chalk.bold('\nEnvironment Info:'));
                require('envinfo')
                    .run(
                        {
                            System: ['OS', 'CPU'],
                            Binaries: ['Node', 'npm'],
                            Browsers: ['Chrome', 'Edge', 'Firefox', 'Safari']
                        },
                        {
                            showNotFound: true,
                            duplicates: true,
                            fullTree: true
                        }
                    )
                    .then(console.log);
            });

        /**
         * Print suggested command in case of no matches.
         */
        program.arguments('<command>').action(cmd => {
            program.outputHelp();
            console.log();
            console.log(
                `  ` + chalk.red(`Unknown command ${chalk.yellow(cmd)}.`)
            );
            console.log();
            suggestCommands(cmd);
        });

        /**
         * Print default CLI message in case of not passed args.
         */
        if (!args.slice(2).length && !testEnv) {
            console.log(startMessage(program.commands));
        }

        program.parse(args);
    });
}

module.exports = commandRunner;
