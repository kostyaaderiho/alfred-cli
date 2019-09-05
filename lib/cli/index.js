const commandRunner = require('../utilities/command-runner');
const getWorkspaceDetails = require('../utilities/project');

/**
 * Intry point for the CLI.
 *
 * @param {array} cliArgs Raw unparsed arguments
 */
function cli(cliArgs) {
    commandRunner(getWorkspaceDetails(), cliArgs);
}

module.exports = cli;
