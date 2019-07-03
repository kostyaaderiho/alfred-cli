import execa from 'execa';
import chalk from 'chalk';
import Listr from 'listr';

const log = console.log;

async function runBuild(targetDirectory) {
    let buildResults = await execa('npm', ['run', 'build'], {
        cwd: targetDirectory
    });

    if (buildResults.failed) {
        return Promise.reject('Failed to production build');
    }

    return buildResults;
}

export async function build() {
    const targetDirectory = process.cwd();

    log('\n');

    const tasks = new Listr([
        {
            title: 'Running production build',
            task: () => runBuild(targetDirectory)
        }
    ]);

    await tasks.run().catch(err => {
        log(`Production build failed due to ${err}`, chalk.bold.red('FAILED'));
        process.exit();
    });

    log('\n');
    log(`Build has been finished successfully, check your ${chalk.blue('/dist')} folder`)
};