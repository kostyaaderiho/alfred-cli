const Blueprint = require('../models/blueprint');
const path = require('path');

const SCHEMATICS = [
    {
        name: 'component',
        URL: 'src/components/'
    }
];

class GenerateCommand {
    constructor({ workspace, options }) {
        this.options = options;
        this.workspace = workspace;
        this._setupSchematicTargetURL();
    }

    _setupSchematicTargetURL() {
        this.options.schematicTargetDir = path.resolve(
            this.workspace.root,
            SCHEMATICS.find(
                schematic => schematic.name === this.options.schematic
            ).URL,
            this.options.schematicName
        );
    }

    async run() {
        let bp = new Blueprint({
            passedName: this.options.schematicName,
            copyPath: this.options.schematicTargetDir,
            type: 'component',
            rename: true
        });
        await bp.load();
    }
}

module.exports = GenerateCommand;
