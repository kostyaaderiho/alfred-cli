const cli = require('../../lib/cli');

module.exports = function alfred(args) {
    let cliInstance;

    cliInstance = cli({
        cliArgs: [...process.argv, ...args],
        testEnv: true
    });

    return cliInstance;
};
