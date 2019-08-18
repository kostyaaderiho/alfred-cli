/**
 * Load module for specified command and.
 *
 * Exit process in case of not installed package.
 */
module.exports = function loadCommand(commandName, moduleName) {
    const isNotFoundError = err => {
        return err.message.match(/Cannot find module/);
    };
    try {
        return require(moduleName);
    } catch (err) {
        console.log();
        console.log(err);
        if (isNotFoundError(err)) {
            const chalk = require('chalk');
            console.log();
            console.log(
                `Command ${chalk.cyan(
                    commandName
                )} requires installed ${chalk.cyan(
                    moduleName.split('/').slice(-1)
                )} module. \n` + `Please check commands folder in CLI project.`
            );
            process.exit(1);
        } else {
            throw err;
        }
    }
};
