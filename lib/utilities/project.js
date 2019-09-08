const path = require('path');
const fs = require('fs');

/**
 * Search for target file in directory.
 *
 * @param {*} names File names.
 * @param {*} from Target directory.
 */
function findUp(names, from) {
    if (!Array.isArray(names)) {
        names = [names];
    }
    const root = path.parse(from).root;

    let currentDir = from;
    while (currentDir && currentDir !== root) {
        for (const name of names) {
            const p = path.join(currentDir, name);
            if (fs.existsSync(p)) {
                return p;
            }
        }
        currentDir = path.dirname(currentDir);
    }
    return null;
}

/**
 * Get project workspace details: root and configuration file.
 */
function getWorkspaceDetails(test) {
    const currentDir = process.cwd();
    const possibleConfigFiles = [
        'alfred.json',
        '.alfred.json',
        'alfred-cli.json',
        '.alfred-cli.json'
    ];
    const configFilePath = findUp(possibleConfigFiles, currentDir);

    // if (test) {
    //     return {
    //         root: currentDir,
    //         configFile: null
    //     };
    // }

    if (configFilePath === null) {
        return null;
    }

    const configFileName = path.basename(configFilePath);
    const possibleDir = test ? currentDir : path.dirname(configFilePath);

    return {
        root: possibleDir,
        configFile: configFileName
    };
}

module.exports = getWorkspaceDetails;
