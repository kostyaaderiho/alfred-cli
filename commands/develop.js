const dotenv = require('dotenv');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');

const pathResolver = moduleName => {
    return path.join(process.cwd(), 'node_modules', moduleName);
};

/**
 * Setup proxy for development server.
 *
 * @param {*} cwd
 * @param {*} proxyOption
 */
function setupProxy(cwd, proxyOption) {
    const { PROXY_TARGET_DEFAULT, PROXY_ENDPOINTS } = require(path.resolve(
        __dirname,
        '..',
        'config/webpack/proxy.js'
    ));
    const proxyEnvFilePath = path.resolve(cwd, '.env');

    let FILE_ENV;

    if (fs.existsSync(proxyEnvFilePath)) {
        let readResult = dotenv.config({ path: proxyEnvFilePath });

        if (readResult.error) {
            throw readResult.parsed;
        }

        FILE_ENV = readResult.parsed;
    }

    const proxyConfiguration = {
        target:
            (FILE_ENV && FILE_ENV.proxy) || proxyOption || PROXY_TARGET_DEFAULT,
        changeOrigin: true,
        ignorePath: false,
        secure: false
    };

    const proxy = PROXY_ENDPOINTS.reduce(
        (accumulator, currentValue) =>
            Object.assign(accumulator, {
                [currentValue]: proxyConfiguration
            }),
        {}
    );

    return proxy;
}

/**
 * Verify if user provided custom webpack config for develop
 *
 * @param {*} webpackConfig Basic webpack config.
 * @param {*} cwd Current working directory.
 */
function checkUserWebpackConfig(webpackConfig, cwd) {
    let userCustomWebpckConfigURL = path.resolve(
        cwd,
        'config/webpack.config.dev.js'
    );

    if (fs.existsSync(userCustomWebpckConfigURL)) {
        const merge = require(pathResolver('webpack-merge'));
        const userCustomConfig = require(userCustomWebpckConfigURL);

        webpackConfig = merge(webpackConfig, userCustomConfig());

        console.log();
        console.log(
            `${chalk.cyan(
                userCustomWebpckConfigURL
            )} has been merged with default!`
        );
        console.log();
    }

    return webpackConfig;
}

/**
 * Setup config files for webpack and webpack-dev-server.
 */
function setupWebpackConfig({
    contentBase,
    proxyOption,
    port,
    open,
    hot,
    cwd
}) {
    const webpackDevServerConfig = {
        proxy: setupProxy(cwd, proxyOption),
        historyApiFallback: true,
        inline: true,
        contentBase,
        port,
        open,
        hot
    };
    const baseConfig = require(path.resolve(
        __dirname,
        '..',
        'config/webpack/webpack.config.base'
    ));
    const defConfig = require(path.resolve(
        __dirname,
        '..',
        'config/webpack/webpack.config.dev'
    ));
    const merge = require(path.resolve(cwd, 'node_modules', 'webpack-merge'));

    let webpackConfig = merge(
        baseConfig(cwd),
        defConfig(cwd, process.env, webpackDevServerConfig)
    );

    webpackConfig = checkUserWebpackConfig(webpackConfig, cwd);
    webpackConfig.entry.main.unshift(
        `webpack-dev-server/client?http://localhost:${webpackDevServerConfig.port}/`
    );

    return {
        webpackDevServerConfig,
        webpackConfig
    };
}

/**
 * Setup webpackDevServer from target repository with set configiration options
 *
 * The command allow to define:
 *
 * @param {string} contentBase The webpack-dev-server will serve the files in the current directory.
 * @param {number} port Local dev server port.
 * @param {boolean} open Open target URL in the default browser.
 * @param {boolean} hot Load the updated modules and inject them into a running app without full page reaload.
 * @param {string} proxyOption Target proxy URL.
 *
 * See webpackDevServer documentation: https://github.com/webpack/docs/wiki/webpack-dev-server
 */
module.exports = function startServer({
    contentBase = path.join(process.cwd(), 'src'),
    proxyOption = null,
    port = 3000,
    open = true,
    hot = true
} = {}) {
    const WebpackDevServer = require(pathResolver('webpack-dev-server'));
    const webpack = require(pathResolver('webpack'));
    const { webpackConfig, webpackDevServerConfig } = setupWebpackConfig({
        cwd: process.cwd(),
        contentBase,
        proxyOption,
        port,
        open,
        hot
    });
    const server = new WebpackDevServer(
        webpack(webpackConfig),
        webpackDevServerConfig
    );

    server.listen(webpackDevServerConfig.port, 'localhost', err => {
        if (err) {
            console.log(err);
            process.exit(1);
        }

        console.log();
        console.log(
            chalk.cyan(
                `Server is started on ${webpackDevServerConfig.port} port!`
            )
        );
        console.log();
    });
};
