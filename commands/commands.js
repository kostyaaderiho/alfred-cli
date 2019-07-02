import { initProject } from './init';
import { startServer } from './develop';

export default [
    // {
    //     description: 'Initialize project',
    //     optionParam: '<projectName>',
    //     run: initProject,
    //     name: 'init',
    //     alias: 'i'
    //     // flags: [{
    //     //     name: '--directory',
    //     //     alias: '--d',
    //     //     description: 'The directory name to create the workspace in.'
    //     // }, {
    //     //     name: '--force',
    //     //     alias: '--f',
    //     //     description: 'When true, forces overwriting of existing files.',
    //     //     default: false,
    //     // }, {
    //     //     name: '--help',
    //     //     alias: '--h',
    //     //     description: 'Shows a help message for this command in the console.',
    //     //     default: false
    //     // }]
    // },
    {
        description: 'Start local dev server',
        optionParam: '',
        run: startServer,
        name: 'develop',
        alias: 'dev'
    }
];
