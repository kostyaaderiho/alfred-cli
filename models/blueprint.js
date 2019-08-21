const promisify = require('util').promisify;
const chalk = require('chalk');
const path = require('path');
const ncp = require('ncp');
const fs = require('fs');

const copy = promisify(ncp);

class Blueprint {
    constructor(options) {
        this.rename = options.rename || false;
        this.passedName = options.passedName;
        this.copyPath = options.copyPath;
        this._parseOptions(options);
    }

    _processBlueprints() {
        let blueprintPath = path.resolve(__dirname, '..', 'blueprints');
        let blueprints = [];

        fs.readdirSync(blueprintPath, 'utf-8').forEach(file => {
            let filePath = path.resolve(blueprintPath, file, 'index.js');
            try {
                let stats = fs.lstatSync(filePath);

                if (stats.isFile()) {
                    blueprints.push(require(filePath));
                }
            } catch (err) {
                console.log();
                console.log(
                    chalk.red(`Missed index.js config file for ${file}.`)
                );
                console.log();
                process.exit();
            }
        });

        return blueprints;
    }

    _parseOptions(options) {
        let blueprints = this._processBlueprints();

        let blueprint = blueprints.find(
            schematic => schematic.type === options.type
        );

        if (!blueprint) {
            console.log();
            console.log(chalk.red(`ERROR! Schematic does not exist.`));
            console.log();
            process.exit();
        }

        this.blueprint = blueprint;
    }

    _validate() {
        const bluePrintPath = this._getBlueprintPath();

        if (!Blueprint._existsSync(bluePrintPath)) {
            console.log();
            console.log(
                chalk.red(
                    `ERROR! The blueprint ${this.blueprint.type} requires installed module.`
                )
            );
            console.log();
            process.exit();
        }
    }

    _getBlueprintPath() {
        return path.resolve(
            Blueprint.defaultLookupPaths(),
            this.blueprint.path
        );
    }

    createFolder() {
        return new Promise((resolve, reject) => {
            fs.mkdir(this.copyPath, err => {
                if (err) {
                    reject(err);
                }
                console.log();
                console.log(
                    `Folder for ${this.blueprint.type} has been created.`
                );
                console.log();
                resolve();
            });
        });
    }

    renameFiles() {
        fs.readdirSync(this.copyPath).forEach(file => {
            let copiedFileName = `${this.copyPath}\\${file.replace(
                this.blueprint.type,
                this.passedName
            )}`;
            fs.renameSync(`${this.copyPath}\\${file}`, `${copiedFileName}`);
            console.log(
                `${chalk.green('CREATE')} ${chalk.white(copiedFileName)}`
            );
        });
    }

    async copy() {
        return copy(this._getBlueprintPath(), this.copyPath, err => {
            if (err) {
                console.log(err);
                process.exit();
            }
        });
    }

    async load() {
        this._validate();
        await this.createFolder();
        await this.copy();
        if (this.rename) this.renameFiles();
    }
}

Blueprint.defaultLookupPaths = function() {
    return path.resolve(__dirname, '..', 'blueprints');
};

Blueprint._existsSync = function(path) {
    return fs.existsSync(path);
};

module.exports = Blueprint;
