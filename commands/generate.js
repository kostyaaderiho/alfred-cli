const Blueprint = require('../models/blueprint');

/**
 * Generate schematic command.
 */
class GenerateCommand {
    constructor({ workspace, options }) {
        this.options = options;
        this.workspace = workspace;
    }

    async run() {
        let bp = new Blueprint({
            passedName: this.options.schematicName,
            copyPath: this.options.copyPath,
            type: 'component',
            rename: true
        });
        await bp.load();
    }
}

module.exports = GenerateCommand;
