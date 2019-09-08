const commandRunner = require('../utilities/command-runner');
const getWorkspaceDetails = require('../utilities/project');

/**
 * Intry point for the CLI.
 *
 * @param {array} cliArgs Raw unparsed arguments
 */
function cli({ cliArgs, testEnv = false }) {
    return commandRunner({
        workspace: getWorkspaceDetails(testEnv),
        args: cliArgs,
        test: testEnv
    });
}

module.exports = cli;
