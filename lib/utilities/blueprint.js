const promisify = require('util').promisify;
const chalk = require('chalk');
const path = require('path');
const ncp = require('ncp');
const fs = require('fs');

const copy = promisify(ncp);

/**
 * Blueprint model class.
 *
 * Defines default behavior for schematic instance.
 */
class Blueprint {
    constructor(options) {
        this.rename = options.rename || false;
        this.passedName = options.passedName;
        this.blueprint = this.processOptions(options);
        this.copyPath = this.processCopyPath(options.copyPath);
    }

    processCopyPath(targetpath) {
        return targetpath.replace(
            this.passedName,
            this.getName(this.passedName)
        );
    }

    getName(name) {
        return this.blueprint.type === 'app'
            ? name
            : name.slice(0, 1).toUpperCase() + name.slice(1);
    }

    /**
     * Retrieve current available blueprints.
     */
    processBlueprints() {
        let blueprintPath = path.resolve(__dirname, '../..', 'blueprints');
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

    /**
     * Get blueprint based on pass type.
     */
    processOptions(options) {
        let blueprints = this.processBlueprints();

        let blueprint = blueprints.find(
            schematic => schematic.type === options.type
        );

        if (!blueprint) {
            console.log();
            console.log(chalk.red(`ERROR! Schematic does not exist.`));
            console.log();
            process.exit();
        }

        return blueprint;
    }

    /**
     * Blueprint validation method.
     */
    validate() {
        const bluePrintPath = this.getBlueprintPath();

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

    /**
     * Get target blueprint path.
     */
    getBlueprintPath() {
        return path.resolve(
            Blueprint.defaultLookupPaths(),
            this.blueprint.path
        );
    }

    /**
     * Create folder in target project.
     */
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

    processFile(filePath) {
        fs.readFile(filePath, 'utf8', (err, file) => {
            if (err) throw err;

            let output = file.replace(
                /<%= name %>/g,
                this.getName(this.passedName)
            );

            fs.writeFile(filePath, output, 'utf8', err => {
                if (err) return console.log(err);
            });
        });
    }

    /**
     * Rename blueprint files based on provided name.
     */
    processFiles() {
        fs.readdirSync(this.copyPath).forEach(file => {
            let copiedFileName = `${this.copyPath}\\${file.replace(
                this.blueprint.type,
                this.getName(this.passedName)
            )}`;
            fs.renameSync(`${this.copyPath}\\${file}`, `${copiedFileName}`);
            this.processFile(copiedFileName);
            console.log(
                `${chalk.green('CREATE')} ${chalk.white(copiedFileName)}`
            );
        });
    }

    /**
     * Copy blueprint files into target project folder.
     */
    async copy() {
        return copy(this.getBlueprintPath(), this.copyPath, err => {
            if (err) {
                console.log(err);
                process.exit();
            }
        });
    }

    /**
     * Main blueprint method.
     */
    async load() {
        this.validate();
        await this.createFolder();
        await this.copy();
        if (this.rename) this.processFiles();
    }
}

Blueprint.defaultLookupPaths = function() {
    return path.resolve(__dirname, '../..', 'blueprints');
};

Blueprint._existsSync = function(path) {
    return fs.existsSync(path);
};

module.exports = Blueprint;
