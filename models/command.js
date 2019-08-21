const chalk = require('chalk');
const path = require('path');
const fs = require('fs');

class Command {
    constructor({ options = {}, workspace, name }) {
        this.isSchematicCommand = null;
        this.schematicCopyURL = null;
        this.workspace = workspace;
        this.options = options;
        this.scope = null;
        this.name = name;
        this.processCommand();
    }

    processCommand() {
        let commandConfig = this.commandConfig();
        this.schematicCopyURL = path.resolve(
            process.cwd(),
            this.options.schematicName
        );
        this.isSchematicCommand = commandConfig.isSchematicCommand;
        this.scope = commandConfig.scope;

        this.validateScope();

        Command.commandMap = require(path.resolve(
            __dirname,
            '..',
            commandConfig.path
        ));
    }

    commandConfig() {
        let commands = require('../commands');
        let command = commands.find(command => command.name === this.name);

        if (!command) {
            console.log(chalk.red(`${this.command} command does not exists!`));
            process.exit();
        }

        return command;
    }

    validateScope() {
        if (
            this.scope === 'in' &&
            (this.workspace === null || !this.workspace.configFile)
        ) {
            console.log();
            console.log(
                chalk.red(
                    `The ${this.name} command requires to be run in an Alfred project, but a project definition could not be found.`
                )
            );
            console.log();
            process.exit();
        }

        if (this.scope === 'out' && this.workspace !== null) {
            console.log();
            console.log(
                chalk.red(
                    `The ${this.name} command requires to be run outside of Alfred project, but a project definition is found.`
                )
            );
            console.log();
            process.exit();
        }

        if (this.isSchematicCommand && fs.existsSync(this.schematicCopyURL)) {
            console.log();
            console.log(
                chalk.yellow(
                    `WARNING! Schematic ${this.schematicCopyURL} already exists.`
                )
            );
            console.log();
            console.log(chalk.red('The Schematic workflow failed.'));
            process.exit();
        }
    }

    async validateAndRun() {
        const startTime = +new Date();

        const command = new Command.commandMap({
            workspace: this.workspace,
            options: this.options
        });
        await command.run();

        const endTime = +new Date();

        console.log();
        console.log(`Command running time: ${endTime - startTime}ms`);
    }
}

module.exports = Command;
