const parseInputOptions = require('../util/options');
const inquirer = require('inquirer');
const xml2js = require('xml2js');
const chalk = require('chalk');
const Listr = require('listr');
const execa = require('execa');
const path = require('path');
const fs = require('fs');

const Blueprint = require('../models/blueprint');
const log = console.log;

const PROJECT_SETUP_QUESTIONS = [
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
];

/**
 * Entry project initialization command.
 */
class Init {
    constructor({ options }) {
        this.options = options;
        this.options.schematicDir = path.resolve(
            __dirname,
            '..',
            'blueprints/app'
        );
        this.options.schematicCopyURL = path.resolve(
            process.cwd(),
            options.schematicName
        );
    }

    /**
     * Install project dependencies into the target directory.
     */
    async installDependecies() {
        const result = await execa('npm', ['install'], {
            cwd: this.options.schematicCopyURL
        });

        if (result.failed) {
            return Promise.reject('Failed to install dependencies');
        }

        return result;
    }

    /**
     * Define project setup questions.
     */
    async promtQuestions() {
        let answers = await inquirer.prompt(PROJECT_SETUP_QUESTIONS);

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
            `${this.options.schematicCopyURL}/README.md`,
            'utf8',
            (err, file) => {
                if (err) throw err;

                let output = file.replace(/<%= name %>/g, projectOptions.name);

                fs.writeFile(
                    `${this.options.schematicCopyURL}/README.md`,
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
        const projectPackageJSON = `${this.options.schematicCopyURL}/package.json`;

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
        const projectCLIFileNameURL = `${this.options.schematicCopyURL}/alfred.json`;

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
        let pomFileURL = path.resolve(this.options.schematicCopyURL, 'pom.xml');
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

    _processFiles(passedOptions) {
        this.updatePackageJSONFile(passedOptions);
        this.updateProjectCLIFile(passedOptions);
        this.updateReadmeFile(passedOptions);
        this.updatePOMFile(passedOptions);
    }

    async run() {
        let passedOptions = await this.promtQuestions();

        const tasks = new Listr([
            {
                title: 'Process project files.',
                task: () => {
                    let bp = new Blueprint({
                        copyPath: this.options.schematicCopyURL,
                        passedName: this.options.schematicName,
                        rename: false,
                        type: 'app'
                    });
                    bp.load().then(() => {
                        this._processFiles(passedOptions);
                    });
                }
            },
            {
                title: 'Install project dependencies with NPM.',
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
