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

export default async function(options) {
    const currentFileDir = import.meta.url;

    options = {
        ...options,
        targetDirectory: options.targetDirectory || process.cwd(),
        templateDirectory: path.resolve(
            new URL(currentFileDir).pathname.slice(1),
            '../../templates/project'
        )
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
