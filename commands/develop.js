import execa from 'execa';
import Listr from 'listr';
import chalk from 'chalk';

const log = console.log;

export async function startServer() {
    const targetDirectory = process.cwd();
    const PORT = 3000;

    log('\n');
    const tasks = new Listr([
        {
            title: 'Running local dev server',
            task: () => {
                execa('npm', ['run', 'develop'], {
                    cwd: targetDirectory
                });
                process.stdin.resume();
            }
        }
    ]);

    await tasks.run().catch(err => {
        log('Start has been failed', chalk.red.bold('FAILED'));
        process.exit();
    });

    log('\n');
    log(`Server is running on ${PORT} port!`);
}
