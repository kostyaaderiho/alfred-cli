const packageJson = require('../../package.json');
const semver_1 = require('semver');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');

/**
 * Retrieve version of current working directory package.json file.
 *
 * @param {*} cwd Current working directory.
 */
function _fromPackageJson(cwd) {
    cwd = cwd || process.cwd();
    do {
        const packageJsonPath = path.join(
            cwd,
            'node_modules/alfred-cli/package.json'
        );
        if (fs.existsSync(packageJsonPath)) {
            const content = fs.readFileSync(packageJsonPath, 'utf-8');
            if (content) {
                const json = JSON.parse(content);
                if (json['version']) {
                    return new semver_1.SemVer(json['version']);
                }
            }
        }
        cwd = path.dirname(cwd);
    } while (cwd != path.dirname(cwd));
    return null;
}

let cli;

try {
    const projectLocalCli = require.resolve('alfred-cli', {
        paths: [process.cwd()]
    });
    const globalVersion = new semver_1.SemVer(packageJson['version']);
    let shouldWarn = false;
    let localVersion;

    /**
     * Verify locally installed CLI version.
     *
     * Show the warning in case of greater version for globally installed package than locally.
     */
    try {
        localVersion = _fromPackageJson();
        shouldWarn =
            localVersion != null && globalVersion.compare(localVersion) > 0;
    } catch (e) {
        console.error(e);
        shouldWarn = true;
    }

    if (shouldWarn) {
        console.log();
        console.log(
            chalk.yellow(
                `Your global Alfred CLI version (${globalVersion}) is greater than your local version (${localVersion}). The local Alfred CLI version is used.`
            )
        );
        console.log();
    }

    cli = require(projectLocalCli);
} catch (err) {
    /**
     * Include globally installed CLI
     *
     * Most common cause for hitting this is `alfred init`
     */
    cli = require('.');
}

cli({
    cliArgs: process.argv
});
