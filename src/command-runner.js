import standartCommands from '../commands/commands';
import program from 'commander';

/**
 * Prepare commands base on predefined map
 * 
 * @param {object} program Commander instaner 
 * @param {*} commands Map of the commands
 */
const generateCommands = (program, commands) => {
    commands.forEach(command => {
        program.command(`${command.name} ${command.optionParam}`);
        program.alias(`${command.alias}`);
        program.description(`${command.description}`);
        program.action((com, param, cmd) => {
            command.run({ param })
        });
        // if (command.flags) {
        //     command.flags.forEach(flag => {
        //         program.option(`${flag.alias}, ${flag.name}, ${flag.description}`, flag.default);
        //     });
        // };
    });
};

/**
 * Run a command
 * 
 * @param {array} cliArgs Raw unparsed arguments 
 * @param {object} commands The map of supported commands
 */
export async function runCommand(cliArgs) {
    generateCommands(program, standartCommands);

    // Display help section in case of not passed arguments
    if (!process.argv.slice(2).length) {
        program.outputHelp();
    };

    program.parse(cliArgs);
};