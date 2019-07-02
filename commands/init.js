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
async function verifyIfTargetFolderCorrect(targetDirectory) {
    if (!fs.existsSync(targetDirectory)) return true;

    // Check if target folder already exists
    log(
        `${chalk.gray(`Folder ${chalk.red(targetDirectory)} already exists!`)}`
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
 * Copy project files into target directory
 *
 * @param {string} templateDirectory
 * @param {string} targetDirectory
 * @param {boolean} force Overwrite destination files that already exist.
 */
async function copyProjectFiles({ templateDirectory, targetDirectory, force }) {
    return copy(templateDirectory, targetDirectory, {
        clobber: force
    });
}

export async function initProject({ param: targetDirectory, force = false }) {
    let options = {
        templateDirectory: path.join(__dirname, '..', 'templates/project'),
        targetDirectory: targetDirectory || process.cwd(),
        force
    };

    // Check if template directory accessible
    try {
        await access(options.templateDirectory, fs.constants.R_OK);
    } catch (err) {
        log('Invalid template name');
        process.exit();
    }

    let proceedWithFolder = await verifyIfTargetFolderCorrect(
        options.targetDirectory
    );

    if (!proceedWithFolder) process.exit();

    const tasks = new Listr([
        {
            title: 'Copy project files',
            task: () => copyProjectFiles(options)
        },
        {
            title: 'Install package dependencies with npm',
            task: () => installDependecies(options.targetDirectory)
        }
    ]);

    await tasks.run().catch(err => {
        console.log(err);
    });

    log('Project ready!', chalk.green.bold('DONE'));

    return true;
}
