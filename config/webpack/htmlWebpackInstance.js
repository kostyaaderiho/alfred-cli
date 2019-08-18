/**
 * Default HTMLWebpackPluginInstance configuration.
 *
 * globalHtmlTemplateSettings is used always.
 *
 * The CLI uses appEntry as a default unless project configuration (alfred.json) exists in installed project.
 */
module.exports = {
    appEntry: {
        applicationId: 'react_application',
        applicationTitle: 'React Applicaiton',
        applicationContent: 'React application',
        filename: 'index.html'
    },
    globalHtmlTemplateSettings: {
        template: 'public/index.html',
        favicon: 'public/icon.png',
        hash: true
    }
};
