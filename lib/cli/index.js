const commandRunner = require('../../models/command-runner');
const getWorkspaceDetails = require('../../util/project');

/**
 * Intry point for the CLI.
 *
 * @param {array} cliArgs Raw unparsed arguments
 */
function cli(cliArgs) {
    commandRunner(getWorkspaceDetails(), cliArgs);
}

module.exports = cli;
