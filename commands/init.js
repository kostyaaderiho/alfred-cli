import { promisify } from 'util';
import chalk from 'chalk';
import Listr from 'listr';
import path from 'path';
import ncp from 'ncp';
import fs from 'fs';

const access = promisify(fs.access);
const copy = promisify(ncp);

async function copyProjectFiles({ templateDirectory, targetDirectory }) {
    return copy(templateDirectory, targetDirectory, {
        clobber: false
    });
}

export async function initProject({ param: targetDirectory }) {
    let options = {
        templateDirectory: path.join(__dirname, '..', 'templates/project'),
        targetDirectory: targetDirectory || process.cwd()
    };

    try {
        await access(options.templateDirectory, fs.constants.R_OK);
    } catch (err) {
        console.log('Invalid template name');
    }

    const tasks = new Listr([
        {
            title: 'Copy project files',
            task: () => copyProjectFiles(options)
        }
    ]);

    await tasks.run();

    console.log('Project ready!', chalk.green.bold('DONE'));

    return true;
}
