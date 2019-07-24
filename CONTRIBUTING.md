## Getting involved

There are many ways to contribute to this project, you can fix issues, update the documentation or work on any of the command in [features-list](https://github.com/kostyaaderiho/alfred-cli/tree/master/commands)

## Development setup

Start by clonning the git project to your hard drive.

```
git clone https://github.com/kostyaaderiho/alfred-cli

```

Install required dependencies related to CLI environment in cloned directory.

```
npm install
```

In order to add new command into CLI, follow the next steps:

- Create a separate file for desired command in `commands` folder with appropriate name. 
- In created file describe desired command work, before editing file have a look at already created commands and investigate their work.
- Update accordingly `alfred.js` file in `bin` folder with created command. The command should include name, description, alias and options if required.
- Run and test your command before trying to publish it. 

## Questions

If you have any questions with usage `alfred-cli` please ask directly author or contributors of this project.

## Issues
Think you've found a bug or want to share a new feature? Let us know!