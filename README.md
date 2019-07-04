# Alfred CLI

The Alfred CLI is a command-line interface tool that you use to initialize, develop, scaffold and maintain your ReactJS applications.

## Installation

> Note: This installation assumes you have Node.js installed locally.

npm install -g alfred-cli

## Usage

After installation the `alfred` command will be available to you.

You can run `alfred` in your CMD and take a look on currently available commands.

Command | Usage | Alias | Description | Options
--- | --- | --- | --- | ---
`init` | `alfred init` [project-name] [options] | i | Initialize project in [project-name] directory | `-f, --f` Rewrite files in the target directory if such already exists. `--skipInstall` When true, does not install dependency packages. Default false.
`develop` | `alfred develop` | dev | Start local dev server
`generate` | `alfred generate` [schematic] [schematicName] [options] | g | Generates files based on a schematic. Available schematic: `component` | `-t, --type` Define component type (func | class)
`build` | `alfred build` | b | Compiles an app into an output directory `dist/`

