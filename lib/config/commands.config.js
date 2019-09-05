/**
 * Contains default configurations for supported commands.
 *
 * In order to add new command, command's default config must be described there.
 *
 * name: command name.
 * scope: describe command running range.
 * isSchematicCommand: specifies commands type.
 * path: command entry file path.
 */
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
