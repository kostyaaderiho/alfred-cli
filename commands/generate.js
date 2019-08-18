const Command = require('../models/command');
const promisify = require('util').promisify;
const chalk = require('chalk');
const path = require('path');
const ncp = require('ncp');
const fs = require('fs');

const copy = promisify(ncp);
const log = console.log;

const SCHEMATICS = [
    {
        name: 'component',
        URL: 'src/components/'
    }
];

class GenerateCommand extends Command {
    constructor(args) {
        super(args);
        this.commandName = 'generate';
        this.scope = 'in';
        this.processOptions();
        this.validate();
    }

    processOptions() {
        if (
            !SCHEMATICS.find(
                schematic => schematic.name === this.options.schematic
            )
        ) {
            console.log();
            console.log(chalk.red(`ERROR! Schematic does not exist.`));
            console.log();
            process.exit();
        }

        this.options = {
            ...this.options,
            schematicTargetDir: this.getSchematicTargetURL(),
            schematicDir: this.getSchematicURL()
        };
    }

    getSchematicURL() {
        return path.resolve(
            __dirname,
            '..',
            `blueprints/${this.options.schematic}`
        );
    }

    getSchematicTargetURL() {
        return path.resolve(
            this.workspace.root,
            SCHEMATICS.find(
                schematic => schematic.name === this.options.schematic
            ).URL,
            this.options.schematicName
        );
    }

    validate() {
        if (!fs.existsSync(this.options.schematicDir)) {
            console.log();
            console.log(
                chalk.red(
                    `ERROR! The schematic ${this.options.schematic} requires installed module.`
                )
            );
            console.log();
            process.exit();
        }

        if (!fs.existsSync(this.options.schematicTargetDir)) {
            fs.mkdir(this.options.schematicTargetDir, () => {
                console.log();
                console.log(
                    `Folder for ${this.options.schematic} has been created.`
                );
                console.log();
            });
        } else if (!this.options.force) {
            console.log();
            console.log(
                chalk.yellow(
                    `WARNING! Schematic ${
                        SCHEMATICS.find(
                            schematic =>
                                schematic.name === this.options.schematic
                        ).URL
                    }${this.options.schematicName} already exists.`
                )
            );
            console.log();
            console.log(chalk.red('The Schematic workflow failed.'));
            process.exit();
        }
    }

    /**
     * Copy files from template directory into the target
     *
     * @param {boolean} force Overwrite destination files that already exist.
     */
    copyFiles() {
        return copy(
            this.options.schematicDir,
            this.options.schematicTargetDir,
            {
                clobber: true
            }
        );
    }

    /**
     * Rename copied files in the target directory with according semanticName
     */
    renameFiles() {
        fs.readdirSync(this.options.schematicTargetDir).forEach(file => {
            let copiedFileName = `${
                this.options.schematicTargetDir
            }\\${file.replace(
                this.options.schematic,
                this.options.schematicName
            )}`;
            fs.renameSync(
                `${this.options.schematicTargetDir}\\${file}`,
                `${copiedFileName}`
            );
            log(`${chalk.green('CREATE')} ${chalk.white(copiedFileName)}`);
        });
    }

    async run() {
        // Copy schematic files into target directory
        this.copyFiles().then(() => this.renameFiles());
    }
}

module.exports = GenerateCommand;
