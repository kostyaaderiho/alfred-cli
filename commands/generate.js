import { promisify } from 'util';
import path from 'path';
import ncp from 'ncp';
import fs from 'fs';
import chalk from 'chalk';

const copy = promisify(ncp);
const log = console.log;

/**
 * Copy files from template directory into the target
 *
 * @param {string} templateDirectory
 * @param {string} targetDirectory
 * @param {boolean} force Overwrite destination files that already exist.
 */
async function copyFiles({ templateDirectory, targetDirectory, force = false }) {
    return copy(templateDirectory, targetDirectory, {
        clobber: force
    });
};

/**
 * Rename copied files in the target directory with according semanticName
 * 
 * @param {*} param0 
 */
function renameFiles({ targetDirectory, semanticName, semantic }) {
    fs.readdirSync(targetDirectory).forEach(file => {
        let copiedFileName = `${targetDirectory}\\${file.replace(semantic, semanticName)}`;
        fs.renameSync(`${targetDirectory}\\${file}`, `${copiedFileName}`);
        log(`${chalk.green('CREATE')} ${chalk.white(copiedFileName)}`);
    });
}

export async function generateSemantic({
    semanticName,
    semantic,
    type
}) {
    let options = {
        templateDirectory: path.join(__dirname, '..', `templates/${semantic}${type ? '-' + type : ''}`),
        targetDirectory: `${process.cwd()}\\${semanticName}`,
        semanticName,
        semantic,
        type
    };

    if (!fs.existsSync(options.targetDirectory)) {
        fs.mkdir(options.targetDirectory, () => { });
    } else {
        console.log(chalk.yellow(`ERROR! Schematic ${semanticName} already exists.`));
        process.exit();
    }

    await copyFiles(options);
    renameFiles(options);
};