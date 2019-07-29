const execa = require('execa');
const chalk = require('chalk');
const Listr = require('listr');
const path = require('path');

const log = console.log;

/**
 * Clean dist directory in target project
 */
async function cleanDist() {
    let cleanResults = await execa('rimraf', ['dist'], {
        cwd: process.cwd()
    });

    if (cleanResults.failed) {
        return Promise.reject('Failed to clean dist folder');
    }

    return cleanResults;
}

/**
 * Make production build for target project
 */
async function runBuild() {
    return new Promise((resolve, reject) => {
        // Require webpack production configuration config from CLI
        const config = require(path.resolve(
            __dirname,
            '..',
            'config/webpack/webpack.config.prod'
        ))(process.env, process.cwd());

        // Require locally installed webpack in target directory
        const webpack = require(path.resolve(
            process.cwd(),
            'node_modules/webpack'
        ));
        const compiler = webpack(config);

        // Run compilation command
        compiler.run(err => {
            if (err) {
                reject(err);
            }
            resolve(true);
        });
    });
}

module.exports = async function build() {
    log();
    log(chalk.cyan('Start creating production build!'));
    log();

    const tasks = new Listr([
        {
            title: 'Clean dist folder',
            task: () => cleanDist()
        },
        {
            title: 'Running production build',
            task: () => runBuild()
        }
    ]);

    await tasks.run().catch(err => {
        log(`Production build failed due to ${err}`, chalk.bold.red('FAILED'));
        process.exit();
    });

    log();
    log(
        `Build has been finished successfully, check your ${chalk.blue(
            'dist'
        )} folder`
    );
};
