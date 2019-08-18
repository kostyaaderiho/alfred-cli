const parseInputOptions = require('../util/options');
const Command = require('../models/command');
const promisify = require('util').promisify;
const inquirer = require('inquirer');
const xml2js = require('xml2js');
const chalk = require('chalk');
const Listr = require('listr');
const execa = require('execa');
const path = require('path');
const ncp = require('ncp');
const fs = require('fs');

const access = promisify(fs.access);
const copy = promisify(ncp);
const log = console.log;

/**
 * Entry project initialization command.
 */
class Init extends Command {
    constructor(args) {
        super(args);
        this.commandName = 'init';
        this.scope = 'out';
        this.options = {
            ...this.options,
            templateDirectory: path.resolve(__dirname, '..', 'blueprints/app'),
            targetDirectory: path.resolve(
                process.cwd(),
                this.options.projectName
            )
        };
    }

    /**
     * Install project dependencies into the target directory.
     */
    async installDependecies() {
        const result = await execa('npm', ['install'], {
            cwd: this.options.targetDirectory
        });

        if (result.failed) {
            return Promise.reject('Failed to install dependencies');
        }

        return result;
    }

    /**
     * Verify if should proceed with setup project into target directory.
     */
    async verifyIfTargetFolderCorrect() {
        if (!fs.existsSync(this.options.targetDirectory) || this.options.force)
            return true;

        // Check if target folder already exists
        log(
            `\n${chalk.gray(
                `Folder ${chalk.red(
                    this.options.projectName
                )} already exists! \n`
            )}`
        );

        const answers = await inquirer.prompt([
            {
                type: 'list',
                name: 'proccedWithFolder',
                message:
                    'Proceed with init process? Files inside of the folder will be overwritten.',
                choices: ['Yes', 'No']
            }
        ]);

        return answers.proccedWithFolder === 'Yes';
    }

    /**
     * Copy app files into target directory.
     */
    copyAppFiles() {
        return copy(
            this.options.templateDirectory,
            this.options.targetDirectory,
            {
                clobber: this.options.force
            }
        );
    }

    /**
     * Define project setup questions.
     */
    async initApplicationSetupQuestions() {
        let answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Please provide desired project name.'
            },
            {
                type: 'input',
                name: 'id',
                message: 'Please provide desired project id.'
            },
            {
                type: 'input',
                name: 'title',
                message:
                    'Please provide desired project title. Used in index.html file.'
            },
            {
                type: 'input',
                name: 'description',
                message:
                    'Please provide desired project description. Used in package.json file and <meta type="description"/>'
            },
            {
                type: 'input',
                name: 'author.name',
                message: 'Please provide project author name.'
            },
            {
                type: 'input',
                name: 'author.email',
                message: 'Please provide project author email.'
            },
            {
                type: 'input',
                name: 'keywords',
                message:
                    'Please provide desired project keywords. Use "," to separate them.'
            }
        ]);

        answers.keywords = answers.keywords
            .split(',')
            .filter(keyword => keyword.length);

        return answers;
    }

    /**
     * Update README.md file based on provided project information.
     *
     * @param {*} projectOptions Project configration options
     */
    updateReadmeFile(projectOptions) {
        fs.readFile(
            `${this.options.targetDirectory}/README.md`,
            'utf8',
            (err, file) => {
                if (err) throw err;

                let output = file.replace(
                    /<projectName>/g,
                    projectOptions.name
                );

                fs.writeFile(
                    `${this.options.targetDirectory}/README.md`,
                    output,
                    'utf8',
                    err => {
                        if (err) return console.log(err);
                    }
                );
            }
        );
    }

    /**
     * Pretify input options based on .json rules before updating package.json file.
     *
     * @param {*} options
     */
    pretifyPackageJSONOptions(options) {
        return {
            name: options.name
                .toLowerCase()
                .trim()
                .replace(/ /g, '-'),
            author: options.author,
            description: options.description.trim(),
            keywords: options.keywords.map(keyword => keyword.toLowerCase())
        };
    }

    /**
     * Update project package.json file based on provided options.
     *
     * @param {*} projectOptions Provided project configiratop options
     */
    updatePackageJSONFile(projectOptions) {
        const projectPackageJSON = `${this.options.targetDirectory}/package.json`;

        fs.readFile(projectPackageJSON, (err, file) => {
            if (err) throw err;

            let updatedFile = Object.assign(
                JSON.parse(file),
                this.pretifyPackageJSONOptions(
                    parseInputOptions(projectOptions)
                )
            );
            fs.writeFileSync(
                projectPackageJSON,
                JSON.stringify(updatedFile, null, 4)
            );
        });
    }

    updateProjectCLIFile(projectOptions) {
        const projectCLIFileNameURL = `${this.options.targetDirectory}/alfred.json`;

        fs.readFile(projectCLIFileNameURL, (err, file) => {
            if (err) throw err;

            let updateCLIFile = Object.assign(JSON.parse(file), {
                id: projectOptions.id,
                title: projectOptions.title,
                description: projectOptions.description
            });

            fs.writeFileSync(
                projectCLIFileNameURL,
                JSON.stringify(updateCLIFile, null, 4)
            );
        });
    }

    updatePOMFile(projectOptions) {
        let pomFileURL = path.resolve(this.options.targetDirectory, 'pom.xml');
        const { parseString } = xml2js;

        if (fs.existsSync(pomFileURL)) {
            fs.readFile(pomFileURL, 'utf-8', (err, file) => {
                if (err) throw err;

                parseString(file, (err, parsedFile) => {
                    if (err) throw err;

                    parsedFile.project.parent[0].artifactId =
                        projectOptions.name;
                    parsedFile.project.groupId[0] = `com.globoforce.${projectOptions.name}`;
                    parsedFile.project.artifactId[0] = projectOptions.name;
                    parsedFile.project.name[0] = projectOptions.name;

                    const builder = new xml2js.Builder();
                    const xml = builder.buildObject(parsedFile);

                    fs.writeFile(pomFileURL, xml, err => {
                        if (err) throw err;
                        // Successfully write in pom.xml file.
                    });
                });
            });
        }
    }

    async run() {
        // Check if template directory accessible
        try {
            await access(this.options.templateDirectory, fs.constants.R_OK);
        } catch (err) {
            log(
                'The project template folder does not exist. Please check your dependencies.'
            );
            process.exit();
        }

        // Check if folder already exist and should proceed with init project
        let proceedWithFolder = await this.verifyIfTargetFolderCorrect();

        if (!proceedWithFolder) process.exit();

        let setupAnswers = await this.initApplicationSetupQuestions();

        log('\n');

        const tasks = new Listr([
            {
                title: 'Copy project files',
                task: () =>
                    this.copyAppFiles().then(() => {
                        this.updatePackageJSONFile(setupAnswers);
                        this.updateProjectCLIFile(setupAnswers);
                        this.updateReadmeFile(setupAnswers);
                        this.updatePOMFile(setupAnswers);
                    })
            },
            {
                title: 'Install project dependencies with NPM',
                task: () => this.installDependecies(),
                skip: () => this.options.skipInstall
            }
        ]);

        await tasks.run().catch(err => {
            console.log(err);
        });

        log('\n');
        log('Project is setup!', chalk.green.bold('DONE'));
        log('\n');

        if (this.options.skipInstall) {
            log(`You haven't installed dev dependencies.`);
            log(
                `Run ${chalk.cyan('npm i')} before running ${chalk.cyan(
                    'alfred develop'
                )} command.`
            );
        } else {
            log(
                `Serve your application: ${chalk.blue(
                    `cd ${this.options.targetDirectory}`
                )} & run ${chalk.blue('alfred develop')}`
            );
        }
    }
}

module.exports = Init;
