const config = require('../blueprints/config/webpack/webpack.config.base');
const WebpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const chalk = require('chalk');
const path = require('path');

/**
 * Setup webpackDevServer from target repository with set configiration options
 * 
 * The command allow to define:
 * 
 * @param {string} contentBase The webpack-dev-server will serve the files in the current directory.
 * @param {number} port Local dev server port.
 * @param {boolean} open Open target URL in the default browser.
 * @param {boolean} hot Load the updated modules and inject them into a running app without full page reaload.
 * 
 * webpackDevServer documentation: https://github.com/webpack/docs/wiki/webpack-dev-server
 */
module.exports = function startServer({
    contentBase = path.join(process.cwd(), 'src'),
    port = 3000,
    open = true,
    hot = true
    // todo: proxy, hot module replacement history-api-fallback
} = {}) {
    let webpackConfig = config(process.env);
    let webpackDevServerConfig = {
        historyApiFallback: true,
        inline: true,
        contentBase,
        port,
        open,
        hot
    };

    webpackConfig.entry.app.unshift(`webpack-dev-server/client?http://localhost:${webpackDevServerConfig.port}/`);

    const compiler = webpack(webpackConfig);
    const server = new WebpackDevServer(compiler, webpackDevServerConfig);

    server.listen(webpackDevServerConfig.port, 'localhost', err => {
        if (err) {
            console.log(err);
            process.exit(1);
        };

        console.log(chalk.cyan(`Server is started on ${webpackDevServerConfig.port} port!`));
    });
};
