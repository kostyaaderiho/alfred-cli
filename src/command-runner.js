import { generateSemantic } from '../commands/generate';
import { startServer } from '../commands/develop';
import { initProject } from '../commands/init';
import { build } from '../commands/build';
import program from 'commander';
import chalk from 'chalk';

const AVAILABLE_COMMANDS = {
    init: {
        description: 'Initialize project',
        alias: 'i'
    },
    develop: {
        description: 'Start local dev server',
        alias: 'd'
    },
    generate: {
        description: 'Generates and/or modifies files based on a schematic.',
        alias: 'g'
    },
    build: {
        description: 'Run production build',
        alias: 'b'
    }
};

const log = console.log;
const greetingMessage = () => {
    let greeting = chalk.green(`\nWelcome to Alfred, ladies and gentlemens!' \n \n`)

    let helpMessage = () => {
        let commands = Object.keys(AVAILABLE_COMMANDS).reduce((accum, current) => {
            let command = AVAILABLE_COMMANDS[current];
            return `${accum}${chalk.blue(`${current} (${command.alias})`)} - ${command.description} \n`;
        }, '');

        return `Available commands: \n\n${chalk.grey(commands)}\nEnjoy!`;
    }

    return `${greeting}${helpMessage()} `;
};

/**
 * Run a command
 * 
 * @param {array} cliArgs Raw unparsed arguments 
 * @param {object} commands The map of supported commands
 */
export async function runCommand(cliArgs) {
    program
        .command('init <projectName>')
        .alias(AVAILABLE_COMMANDS.init.alias)
        .description('')
        .option('-f, --force', AVAILABLE_COMMANDS.init.description)
        .action((projectName, options) => initProject({
            force: !!options.force,
            projectName
        }));

    program
        .command('develop')
        .alias(AVAILABLE_COMMANDS.init.alias)
        .description(AVAILABLE_COMMANDS.develop.description)
        .action(() => startServer());

    program
        .command('generate <semantic> <semanticName>')
        .alias(AVAILABLE_COMMANDS.generate.alias)
        .description(AVAILABLE_COMMANDS.generate.description)
        .option('-t, --type [componentType]', 'Define component type')
        .action((semantic, semanticName, options) => generateSemantic({
            type: options.type || 'func',
            semanticName,
            semantic
        }));

    program
        .command('build')
        .alias(AVAILABLE_COMMANDS.build.alias)
        .description(AVAILABLE_COMMANDS.build.description)
        .action(() => build())

    // Display greeting and help section in case of not passed arguments
    if (!process.argv.slice(2).length) {
        log(greetingMessage());
    };

    program.parse(cliArgs);
};