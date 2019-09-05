const parseInputOptions = require('../utilities/options');
const inquirer = require('inquirer');
const xml2js = require('xml2js');
const chalk = require('chalk');
const Listr = require('listr');
const execa = require('execa');
const path = require('path');
const fs = require('fs');

const { PROJECT_SETUP_QUESTIONS } = require('./init.config');
const Blueprint = require('../utilities/blueprint');
const log = console.log;

/**
 * Project bootstrap command.
 */
class Init {
    constructor({ options }) {
        this.options = options;
        this.options.schematicDir = path.resolve(
            __dirname,
            '../..',
            'blueprints/app'
        );
    }

    /**
     * Install project dependencies into the target directory.
     */
    async installDependecies() {
        const result = await execa('npm', ['install'], {
            cwd: this.options.copyPath
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
            `${this.options.copyPath}/README.md`,
            'utf8',
            (err, file) => {
                if (err) throw err;

                let output = file.replace(/<%= name %>/g, projectOptions.name);

                fs.writeFile(
                    `${this.options.copyPath}/README.md`,
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
        const projectPackageJSON = `${this.options.copyPath}/package.json`;

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
        const projectCLIFileNameURL = `${this.options.copyPath}/alfred.json`;

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
        let pomFileURL = path.resolve(this.options.copyPath, 'pom.xml');
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

    processFiles(passedOptions) {
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
                        passedName: this.options.schematicName,
                        copyPath: this.options.copyPath,
                        rename: false,
                        type: 'app'
                    });
                    bp.load().then(() => {
                        this.processFiles(passedOptions);
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
                    `cd ${this.options.schematicName}`
                )} & run ${chalk.blue('alfred develop')}`
            );
        }
    }
}

module.exports = Init;
