const loadCommand = require('../util/loadCommand');
const didYouMean = require('didyoumean');
const program = require('commander');
const chalk = require('chalk');

/**
 * Suggest command that is similar to typed command
 *
 * @param {string} cmd Typed command in CMD
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
 * Run a command.
 *
 * @param {*} workspace Current running workspace.
 * @param {*} args Raw CLI arguments.
 */
async function commandRunner(workspace, args) {
    if (!args.slice(2).length) {
        console.log(
            chalk.blue(`\nWelcome to Alfred, ladies and gentlemens!' \n`)
        );
        program.outputHelp();
    }

    program
        .command('init <projectName>')
        .alias('i')
        .description('Initialize your project in <projectName> directory.')
        .option('--force', 'Rewrite files in the target directory')
        .option(
            '--skip-install',
            'When true, does not install dependency packages.'
        )
        .action((projectName, options) => {
            let InitCommand = loadCommand('init', '../commands/init');
            let command = new InitCommand({
                workspace,
                options: {
                    skipInstall: !!options.skipInstall,
                    force: !!options.force,
                    projectName
                }
            });
            command.validateAndRun();
        });

    program
        .command('develop')
        .alias('dev')
        .description('Start local dev server.')
        .option('--port <portNumber>', 'Local dev server port.')
        .option('--proxy <proxyURL>', 'Target proxy URL')
        .action(options => {
            let DevCommand = loadCommand('develop', '../commands/develop');
            let command = new DevCommand({
                workspace,
                options: {
                    proxyOption: options.proxy,
                    port: options.port
                }
            });
            command.validateAndRun();
        });

    program
        .command('build')
        .alias('b')
        .description('Compiles the app into an output directory.')
        .action(() => {
            let BuildCommand = loadCommand('build', '../commands/build');
            let command = new BuildCommand({
                workspace
            });
            command.validateAndRun();
        });

    program
        .command('generate <shematic> <shematicName>')
        .alias('g')
        .description('Generates files based on a schematic')
        .option(
            '-f, --force',
            'When true, forces overwriting of existing files.'
        )
        .action((schematic, schematicName) => {
            let GenerateCommand = loadCommand(
                'generate',
                '../commands/generate'
            );
            let command = new GenerateCommand({
                workspace,
                options: {
                    schematicName,
                    schematic
                }
            });
            command.validateAndRun();
        });

    program.arguments('<command>').action(cmd => {
        program.outputHelp();
        console.log();
        console.log(`  ` + chalk.red(`Unknown command ${chalk.yellow(cmd)}.`));
        console.log();
        suggestCommands(cmd);
    });

    program
        .command('info')
        .description('print debugging information about your environment')
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

    program.parse(args);

    program.arguments('<command>').action(cmd => {
        program.outputHelp();
        console.log();
        console.log(`  ` + chalk.red(`Unknown command ${chalk.yellow(cmd)}.`));
        console.log();
        suggestCommands(cmd);
    });
}

module.exports = commandRunner;
