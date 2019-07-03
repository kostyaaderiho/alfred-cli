import { promisify } from 'util';
import Listr from 'listr';
import path from 'path';
import ncp from 'ncp';
import fs from 'fs';

const copy = promisify(ncp);

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
}

/**
 * Rename copied files in target directory with according semanticName
 * 
 * @param {*} param0 
 */
function renameFiles({ targetDirectory, semanticName, semantic }) {
    fs.readdirSync(targetDirectory).forEach(file => {
        fs.rename(`${targetDirectory}/${file}`, `${targetDirectory}/${file.replace(semantic, semanticName)}`, () => {
        });
    });
}

export async function generateSemantic({
    semanticName,
    semantic,
    type
}) {
    let options = {
        templateDirectory: path.join(__dirname, '..', `templates/${semantic}${type ? '-' + type : ''}`),
        targetDirectory: `${process.cwd()}/${semanticName}`,
        semanticName,
        semantic,
        type
    };

    if (!fs.existsSync(options.targetDirectory)) {
        fs.mkdir(options.targetDirectory, () => { });
    }

    let tasks = new Listr([
        {
            title: `Generate files for ${semantic}`,
            task: () => {
                copyFiles(options).then(() => {
                    renameFiles(options);
                });
            }
        }
    ]);

    await tasks.run().catch(err => {
        console.log(err);
    });
};