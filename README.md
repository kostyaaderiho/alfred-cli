# Alfred CLI

The Alfred CLI is a command-line interface tool that you use to initialize, develop, scaffold and maintain your ReactJS applications.

## Features

- ES6 transpilation using Babel.
- Development server including live-realod and API proxy.
- File/Project generator using blueprints.
- Etc...

## Installation

> Note: This installation assumes you have Node.js and NPM installed locally.

```
npm install -g alfred-cli
```

## Usage

After installation the `alfred <command>` command will be available to you.

You can run `alfred` in your CMD and take a look on currently available commands.

Command | Usage | Alias | Description | Options
--- | --- | --- | --- | ---
`init` | `alfred init <projectName> [options]` | i | Initialize your project in `<projectName>` directory. | `-f, --force` Rewrite files in the target directory if such already exists. `-si, --skipInstall` When true, does not install dependency packages. Default `false`.
`develop` | `alfred develop [options]` | dev | Start local dev server | `-p, --port` Development server port. Default `3000`. `-cb, --content-base` The webpack-dev-server will serve the files in the current directory Default `src`. `-h, --hot` Dinamically inject updated modules into the page without page reload. Default `true`. `-o, --open` Open target URL in the default browser. Default `true`.
`generate` | `alfred generate <schematic> <schematicName> [options]` | g | Generates files based on a schematic. Available schematic: `component` | `-t, --type` Define component type `(func | class)`
`build` | `alfred build` | b | Compiles app into the output directory `dist`

## Contributing

Please see the [contributing guide](https://github.com/kostyaaderiho/alfred-cli/blob/master/CONTRIBUTING.md).

## Licence

