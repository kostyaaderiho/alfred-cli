const chalk = require('chalk');

class Command {
    constructor({ options = {}, workspace }) {
        this.workspace = workspace;
        this.options = options;
    }

    /**
     * Validate command running scope.
     */
    validateScope() {
        if (
            this.scope === 'in' &&
            (this.workspace === null || !this.workspace.configFile)
        ) {
            console.log();
            console.log(
                chalk.red(
                    `The ${this.commandName} command requires to be run in an Alfred project, but a project definition could not be found.`
                )
            );
            console.log();
            process.exit();
        }

        if (this.scope === 'out' && this.workspace !== null) {
            console.log();
            console.log(
                chalk.red(
                    `The ${this.commandName} command requires to be run outside of Alfred project, but a project definition is found.`
                )
            );
            console.log();
            process.exit();
        }
    }

    async validateAndRun() {
        this.validateScope();

        const startTime = +new Date();
        await this.run();
        const endTime = +new Date();

        console.log();
        console.log(`Command running time: ${endTime - startTime}ms`);
    }
}

module.exports = Command;
