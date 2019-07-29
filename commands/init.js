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
 * Install project dependencies into the target directory
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
 * Verify if should proceed with set target folder
 *
 * @param {string} targetDirectory Folder where files are copied to
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
 * Copy app files into target directory
 *
 * @param {string} templateDirectory Project template files directory
 * @param {string} targetDirectory Target directory where filles will be copied to
 * @param {boolean} force Overwrite destination files that already exist.
 */
async function copyAppFiles({ templateDirectory, targetDirectory, force }) {
    return copy(templateDirectory, targetDirectory, {
        clobber: force
    });
}

/**
 * Define project setup questions
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
            name: 'author',
            message: 'Please provide project author name.'
        },
        {
            type: 'input',
            name: 'keywords',
            message:
                'Please provide desired project keywords. Use "," to separate them.'
        }
    ]);
}

function updateReadmeFile(projectOptions, targetDirectory) {
    fs.readFile(`${targetDirectory}/README.md`, 'utf8', (err, file) => {
        if (err) throw err;

        let output = file.replace(/<projectName>/g, projectOptions.name);

        fs.writeFile(`${targetDirectory}/README.md`, output, 'utf8', err => {
            if (err) return console.log(err);
        });
    });
}

function updatePackageJsonFile(projectOptions, targetDirectory) {
    const projectPackageJSON = `${targetDirectory}/package.json`;

    fs.readFile(projectPackageJSON, (err, file) => {
        if (err) throw err;

        let updatedFile = Object.assign(JSON.parse(file), projectOptions);
        fs.writeFileSync(
            projectPackageJSON,
            JSON.stringify(updatedFile, null, 4)
        );
    });
}

/**
 * Entry project initialization method
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
                    updatePackageJsonFile(
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
            `Run ${chalk.cyan(
                'npm i'
            )} before running dev server in the project root.`
        );
    } else {
        log(
            `Serve your application: ${chalk.blue(
                `cd ${targetDirectory}`
            )} & run ${chalk.blue('alfred develop')}`
        );
    }
};
