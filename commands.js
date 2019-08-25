module.exports = [
    {
        name: 'init',
        scope: 'out',
        isSchematicCommand: true,
        path: './commands/init.js'
    },
    {
        name: 'generate',
        scope: 'in',
        isSchematicCommand: true,
        path: './commands/generate.js'
    },
    {
        name: 'develop',
        scope: 'in',
        isSchematicCommand: false,
        path: './commands/develop.js'
    },
    {
        name: 'build',
        scope: 'in',
        isSchematicCommand: false,
        path: './commands/build.js'
    }
];
