const Command = require('../models/command');
const execa = require('execa');
const chalk = require('chalk');
const Listr = require('listr');
const path = require('path');
const log = console.log;

class BuildCommand extends Command {
    constructor(args) {
        super(args);
        this.commandName = 'build';
        this.scope = 'in';
    }

    /**
     * Clean dist directory in target project
     */
    async cleanDist() {
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
    async runBuild() {
        return new Promise((resolve, reject) => {
            // Require webpack production configuration config from CLI
            const config = require(path.resolve(
                __dirname,
                '..',
                'config/webpack/webpack.config.prod'
            ))(process.cwd());

            // Require locally installed webpack in target directory
            const webpack = require('webpack');
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

    async run() {
        log();
        log(chalk.cyan('Start creating production build!'));
        log();

        const tasks = new Listr([
            {
                title: 'Cleaning dist folder.',
                task: () => this.cleanDist()
            },
            {
                title: 'Running production build.',
                task: () => this.runBuild()
            }
        ]);

        await tasks.run().catch(err => {
            log(
                `Production build failed due to ${err}`,
                chalk.bold.red('FAILED')
            );
            process.exit();
        });

        log();
        log(
            `Congrats! Build has been finished ${chalk.green.bold(
                'successfully'
            )}. Explore your ${chalk.blue('dist')} folder.`
        );
    }
}

module.exports = BuildCommand;
