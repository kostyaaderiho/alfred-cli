import init from '../commands/init';

export async function cli(rawArgs) {
    let args = rawArgs.slice(2);
    let script = args[0];
    let targetDirectory = args.slice(1)[0];

    switch (script) {
        case 'init':
            init({
                targetDirectory
            });
            break;
        case 'generate':
            // TODO: generate assests command
            break;
        default:
            console.log(
                `Unknown script "${script}", perhaps you need to update "alfred-cli"`
            );
            console.log(`See documentation here: <link>`);
            break;
    }
}
