const BLUEPRINTS_CONFIG = require('../config/blueprints.config');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');

/**
 * Root command class.
 *
 * Defines default behavior for all commands.
 */
class Command {
    constructor({ options = {}, workspace, name }) {
        this.workspace = workspace;
        this.options = options;
        this.name = name;
        this.processCommand();
    }

    /**
     * Process command based on passed options.
     */
    processCommand() {
        let commandConfig = this.getCommandConfig();

        this.scope = commandConfig.scope || null;
        this.isSchematicCommand = commandConfig.isSchematicCommand;

        if (this.isSchematicCommand) {
            this.options.copyPath =
                this.name === 'init'
                    ? path.resolve(process.cwd(), this.options.schematicName)
                    : path.resolve(
                          this.workspace.root,
                          BLUEPRINTS_CONFIG.find(
                              schematic =>
                                  schematic.name === this.options.schematic
                          ).copyPath,
                          this.options.schematicName
                      );
        }

        this.validate();

        Command.commandMap = require(path.resolve(
            __dirname,
            '..',
            commandConfig.path
        ));
    }

    /**
     * Retrieve command config.
     */
    getCommandConfig() {
        let commands = require('../config/commands.config');
        let command = commands.find(command => command.name === this.name);

        if (!command) {
            console.log(chalk.red(`${this.command} command does not exists!`));
            process.exit();
        }

        return command;
    }

    /**
     * Validation method.
     *
     * Used before execution commad run method.
     */
    validate() {
        if (!this.scope) {
            console.log();
            console.log(
                `The scope for ${this.name} is not defined, correct commands.js file.`
            );
            console.log();
        }
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

        if (this.isSchematicCommand && fs.existsSync(this.options.copyPath)) {
            console.log();
            if (this.name === 'init') {
                console.log(
                    chalk.yellow(
                        `WARNING! The project ${this.options.copyPath} already exists.`
                    )
                );
            } else {
                console.log(
                    chalk.yellow(
                        `WARNING! The ${this.options.schematic} already exists ${this.options.copyPath}.`
                    )
                );
            }

            console.log();
            console.log(chalk.red('The command workflow failed.'));
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
