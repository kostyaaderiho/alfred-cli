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
    }
];
