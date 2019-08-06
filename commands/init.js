const promisify = require('util').promisify;
const inquirer = require('inquirer');
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
 * Install project dependencies into the target directory.
 *
 * @param {string} targetDirectory Folder where files are copied to
 */
async function installDependecies(targetDirectory) {
    const result = await execa('npm', ['install'], {
        cwd: targetDirectory
    });

    if (result.failed) {
        return Promise.reject('Failed to install dependencies');
    }

    return result;
}

/**
 * Verify if should proceed with setup project into target directory.
 *
 * @param {string} targetDirectory Folder where files are copied to
 * @param {boolean} force Overrwrite files into the target directory
 */
async function verifyIfTargetFolderCorrect(targetDirectory, force) {
    if (!fs.existsSync(targetDirectory) || force) return true;

    // Check if target folder already exists
    log(
        `\n${chalk.gray(
            `Folder ${chalk.red(targetDirectory)} already exists! \n`
        )}`
    );

    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'proccedWithFolder',
            message:
                'Proceed with init process? Files inside of the folder will be overwritten',
            choices: ['Yes', 'No']
        }
    ]);

    return answers.proccedWithFolder === 'Yes';
}

/**
 * Copy app files into target directory.
 *
 * @param {string} templateDirectory Project template files directory
 * @param {string} targetDirectory Target directory where files will be copied to
 * @param {boolean} force Overwrite destination files that already exist
 */
async function copyAppFiles({ templateDirectory, targetDirectory, force }) {
    return copy(templateDirectory, targetDirectory, {
        clobber: force
    });
}

/**
 * Define project setup questions.
 */
async function applicationSetupQuestions() {
    return await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Please provide desired project name.'
        },
        {
            type: 'input',
            name: 'description',
            message: 'Please provide desired project description.'
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
}

/**
 * Update README.md file based on provided project information.
 *
 * @param {*} projectOptions Project configration options
 * @param {*} targetDirectory Target folder where project will be setup
 */
function updateReadmeFile(projectOptions, targetDirectory) {
    fs.readFile(`${targetDirectory}/README.md`, 'utf8', (err, file) => {
        if (err) throw err;

        let output = file.replace(/<projectName>/g, projectOptions.name);

        fs.writeFile(`${targetDirectory}/README.md`, output, 'utf8', err => {
            if (err) return console.log(err);
        });
    });
}

/**
 * Simple object check.
 *
 * @param item Checked item
 */
function isObject(item) {
    return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * Deep objects merge method,
 *
 * @param {*} target Target object
 * @param  {...any} sources Merged object
 */
function mergeDeep(target, ...sources) {
    if (!sources.length) return target;
    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, { [key]: {} });
                mergeDeep(target[key], source[key]);
            } else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }

    return mergeDeep(target, ...sources);
}

/**
 * Parse input options during project creation.
 * Allows to predefine configuration with nested options.
 *
 * @param {*} options Input users options.
 */
function parseInputOptions(options) {
    let parsedOptions = {};

    for (let opt in options) {
        let optionPath = opt.split('.');
        let parsedOption = {};

        for (let i = 0; i < optionPath.length; i++) {
            if (i === 0) {
                parsedOption[optionPath[i]] =
                    optionPath.length === 1 ? options[opt] : {};
            } else {
                if (i === optionPath.length - 1) {
                    parsedOption[optionPath[i - 1]][optionPath[i]] = options[
                        opt
                    ].trim();
                } else {
                    parsedOption[optionPath[i - 1]][optionPath[i]] = {};
                }
            }
        }
        parsedOptions = mergeDeep(parsedOptions, parsedOption);
    }

    return parsedOptions;
}

/**
 * Pretify input options based on .json rules before updating package.json file.
 *
 * @param {*} options
 */
function pretifyPackageJSONOptions(options) {
    return {
        ...options,
        name: options.name
            .toLowerCase()
            .trim()
            .replace(/ /g, '-'),
        description: options.description.trim(),
        keywords: options.keywords.map(keyword => keyword.toLowerCase())
    };
}

/**
 * Update project package.json file based on provided options.
 *
 * @param {*} projectOptions Provided project configiratop options
 * @param {*} targetDirectory Project directory
 */
function updatePackageJSONFile(projectOptions, targetDirectory) {
    const projectPackageJSON = `${targetDirectory}/package.json`;

    fs.readFile(projectPackageJSON, (err, file) => {
        if (err) throw err;

        let updatedFile = Object.assign(
            JSON.parse(file),
            pretifyPackageJSONOptions(parseInputOptions(projectOptions))
        );
        fs.writeFileSync(
            projectPackageJSON,
            JSON.stringify(updatedFile, null, 4)
        );
    });
}

/**
 * Entry project initialization method.
 *
 * @param {string} projectName Further project and target folder name
 * @param {boolean} skipInstall Skipping install dependencies flag
 * @param {boolean} force Rewrite already existing folder flag
 */
module.exports = async function initProject({
    projectName: targetDirectory,
    skipInstall,
    force
}) {
    let options = {
        templateDirectory: path.join(__dirname, '..', 'blueprints/app'),
        targetDirectory: targetDirectory || process.cwd(),
        skipInstall,
        force
    };

    // Check if template directory accessible
    try {
        await access(options.templateDirectory, fs.constants.R_OK);
    } catch (err) {
        log('Invalid template name or folder does not exist.');
        process.exit();
    }

    // Check if folder already exist and should proceed with init project
    let proceedWithFolder = await verifyIfTargetFolderCorrect(
        options.targetDirectory,
        force
    );

    if (!proceedWithFolder) process.exit();

    let setupAnswers = await applicationSetupQuestions();
    setupAnswers.keywords = setupAnswers.keywords
        .split(',')
        .filter(keyword => keyword.length);

    log('\n');
    const tasks = new Listr([
        {
            title: 'Copy project files',
            task: () =>
                copyAppFiles(options).then(() => {
                    updatePackageJSONFile(
                        setupAnswers,
                        options.targetDirectory
                    );
                    updateReadmeFile(setupAnswers, targetDirectory);
                })
        },
        {
            title: 'Install project dependencies with NPM',
            task: () => installDependecies(options.targetDirectory),
            skip: () => options.skipInstall
        }
    ]);

    await tasks.run().catch(err => {
        console.log(err);
    });

    log('\n');
    log('Project is setup!', chalk.green.bold('DONE'));
    log('\n');

    if (options.skipInstall) {
        log(`You haven't installed dev dependencies.`);
        log(
            `Run ${chalk.cyan('npm i')} before running ${chalk.cyan(
                'alfred develop'
            )} command.`
        );
    } else {
        log(
            `Serve your application: ${chalk.blue(
                `cd ${targetDirectory}`
            )} & run ${chalk.blue('alfred develop')}`
        );
    }
};
