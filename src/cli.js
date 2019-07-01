import { runCommand } from './command-runner';

export async function cli(rawArgs) {
    runCommand(rawArgs);
};
