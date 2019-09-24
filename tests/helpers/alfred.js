const cli = require('../../lib/cli');

/**
 * Init alfred instance for testing purpose.
 *
 * Setup environment as test.
 */
module.exports = function alfred(args) {
    let cliInstance;

    cliInstance = cli({
        cliArgs: [...process.argv, ...args],
        testEnv: true
    });

    return cliInstance;
};
