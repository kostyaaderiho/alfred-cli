import { promisify } from 'util';
import inquirer from 'inquirer';
import chalk from 'chalk';
import Listr from 'listr';
import path from 'path';
import ncp from 'ncp';
import fs from 'fs';
import execa from 'execa';

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
        `\n${chalk.gray(`Folder ${chalk.red(targetDirectory)} already exists! \n`)}`
    );

    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'proccedWithFolder',
            message: 'Do you wanna to procced and generate files inside?',
            choices: ['Yes', 'No']
        }
    ]);

    return answers.proccedWithFolder === 'Yes';
}

/**
 * Copy app files into target directory
 *
 * @param {string} templateDirectory
 * @param {string} targetDirectory
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
            message: 'Please provide desired project name'
        },
        {
            type: 'input',
            name: 'description',
            message: 'Please provide desired project description'
        },
        {
            type: 'input',
            name: 'keywords',
            message: 'Please provide desired project keywords. Use "," to separate them.'
        }
    ]);;
}

function updateReadmeFile(projectOptions, targetDirectory) {
    fs.readFile(`${targetDirectory}/README.md`, 'utf8', (err, file) => {
        if (err) throw err;

        let output = file.replace(/<projectName>/g, projectOptions.name);

        fs.writeFile(`${targetDirectory}/README.md`, output, 'utf8', function (err) {
            if (err) return console.log(err);
        });
    });
}

async function updatePackageJsonFile(projectOptions, targetDirectory) {
    const projectPackageJSON = `${targetDirectory}/package.json`;

    fs.readFile(projectPackageJSON, (err, file) => {
        if (err) throw err;

        try {
            let updatedFile = Object.assign(JSON.parse(file), projectOptions);

            fs.writeFileSync(projectPackageJSON, JSON.stringify(updatedFile, null, 4));
        } catch (e) {
            throw e;
        }
    });
}

export async function initProject({ projectName: targetDirectory, force }) {
    let options = {
        templateDirectory: path.join(__dirname, '..', 'templates/app'),
        targetDirectory: targetDirectory || process.cwd(),
        force
    };

    // Check if template directory accessible
    try {
        await access(options.templateDirectory, fs.constants.R_OK);
    } catch (err) {
        log('Invalid template name or folder does not exist.');
        process.exit();
    }

    let proceedWithFolder = await verifyIfTargetFolderCorrect(
        options.targetDirectory,
        force
    );

    if (!proceedWithFolder) process.exit();

    let setupAnswers = await applicationSetupQuestions();
    setupAnswers.keywords = setupAnswers.keywords.split(',').filter(keyword => keyword.length)

    log('\n');
    const tasks = new Listr([
        {
            title: 'Copy project files',
            task: () => copyAppFiles(options).then(() => {
                updatePackageJsonFile(setupAnswers, options.targetDirectory);
                updateReadmeFile(setupAnswers, targetDirectory);
            })
        },
        {
            title: 'Install package dependencies with npm',
            task: () => installDependecies(options.targetDirectory)
        }
    ]);

    await tasks.run().catch(err => {
        console.log(err);
    });

    log('\n');
    log('Project ready!', chalk.green.bold('DONE'));
    log(`Serve your application: ${chalk.blue(`cd /${targetDirectory}`)} & run ${chalk.blue('alfred develop')}`);
}
