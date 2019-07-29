const chalk = require('chalk');
const path = require('path');

const pathResolver = moduleName => {
    return path.join(process.cwd(), 'node_modules', moduleName);
};

const endpoints = [
    '/recognition-config-service',
    '/currency-service-app',
    '/cookie-banner-ui-app',
    '/storage-service-app',
    '/client-service-app',
    '/award-service',
    '/login-ui-app',
    '/microsites',
    '/nomination',
    '/global-nav',
    '/3rd-party',
    '/t_static',
    '/pictures',
    '/ec-api',
    '/award',
    '/ws'
];

const proxyConfiguration = {
    target: 'https://localhost',
    changeOrigin: true,
    ignorePath: false,
    secure: false
};

const proxy = endpoints.reduce(
    (accumulator, currentValue) =>
        Object.assign(accumulator, {
            [currentValue]: proxyConfiguration
        }),
    {}
);

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
 * See webpackDevServer documentation: https://github.com/webpack/docs/wiki/webpack-dev-server
 */
module.exports = function startServer({
    contentBase = path.join(process.cwd(), 'src'),
    port = 3000,
    open = true,
    hot = true
} = {}) {
    const config = require(path.resolve(
        __dirname,
        '..',
        'config/webpack/webpack.config.base'
    ));
    const WebpackDevServer = require(pathResolver('webpack-dev-server'));
    const webpack = require(pathResolver('webpack'));

    let webpackConfig = config(process.env, process.cwd());
    let webpackDevServerConfig = {
        historyApiFallback: true,
        inline: true,
        contentBase,
        proxy,
        port,
        open,
        hot
    };

    webpackConfig.entry.app.unshift(
        `webpack-dev-server/client?http://localhost:${webpackDevServerConfig.port}/`
    );
    webpackConfig.mode = 'development';

    const compiler = webpack(webpackConfig);
    const server = new WebpackDevServer(compiler, webpackDevServerConfig);

    server.listen(webpackDevServerConfig.port, 'localhost', err => {
        if (err) {
            console.log(err);
            process.exit(1);
        }

        console.log(
            chalk.cyan(
                `Server is started on ${webpackDevServerConfig.port} port!`
            )
        );
    });
};
