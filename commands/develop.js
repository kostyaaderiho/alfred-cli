const Command = require('../models/command');
const dotenv = require('dotenv');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');

/**
 * Setup webpackDevServer from target repository with set configiration options
 *
 * @see webpackDevServer documentation: https://github.com/webpack/docs/wiki/webpack-dev-server
 */
class DevCommand extends Command {
    constructor(args) {
        super(args);
        this.commandName = 'develop';
        this.scope = 'in';
    }

    validateParams() {
        if (this.options.port && isNaN(this.options.port)) {
            console.log();
            console.log(chalk.red(`Option <port> is not a number`));
            console.log();
            process.exit(1);
        }
    }

    /**
     * Setup proxy for development server.
     *
     * @param {*} proxyOption
     */
    setupProxy(proxyOption) {
        const { PROXY_TARGET_DEFAULT, PROXY_ENDPOINTS } = require(path.resolve(
            __dirname,
            '..',
            'config/webpack/proxy.js'
        ));
        const proxyEnvFilePath = path.resolve(process.cwd(), '.env');

        let FILE_ENV;

        /**
         * Verify if user provides .env file with proxy configurations.
         */
        if (fs.existsSync(proxyEnvFilePath)) {
            let readResult = dotenv.config({ path: proxyEnvFilePath });

            if (readResult.error) {
                throw readResult.parsed;
            }

            FILE_ENV = readResult.parsed;
        }

        const proxyConfiguration = {
            target:
                (FILE_ENV && FILE_ENV.proxy) ||
                proxyOption ||
                PROXY_TARGET_DEFAULT,
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
     */
    getUserWebpackDevConfig() {
        let userCustomWebpckConfigURL = path.resolve(
            process.cwd(),
            'config/webpack.config.dev.js'
        );

        if (fs.existsSync(userCustomWebpckConfigURL)) {
            return require(userCustomWebpckConfigURL);
        }

        return {};
    }

    /**
     * Setup config files for webpack and webpack-dev-server.
     */
    setupWebpackConfig() {
        const configDir = path.resolve(__dirname, '..', 'config/webpack');
        const { DEFAULT_OPTIONS } = require(path.resolve(
            configDir,
            'webpackDevServer.js'
        ));
        const webpackDevServerConfig = {
            historyApiFallback: DEFAULT_OPTIONS.historyApiFallback,
            contentBase: path.resolve(this.workspace.root, 'src'),
            proxy: this.setupProxy(this.options.proxyOption),
            port: this.options.port || DEFAULT_OPTIONS.port,
            inline: DEFAULT_OPTIONS.inline,
            open: DEFAULT_OPTIONS.open
        };

        const baseConfig = require(path.resolve(
            configDir,
            'webpack.config.base'
        ));
        const devConfig = require(path.resolve(
            configDir,
            'webpack.config.dev'
        ));
        const merge = require('webpack-merge');
        const cwd = process.cwd();
        const userCustomConfig = this.getUserWebpackDevConfig();

        let webpackConfig = merge([
            typeof userCustomConfig === 'function'
                ? userCustomConfig()
                : userCustomConfig,
            baseConfig(cwd),
            devConfig(cwd, process.env, webpackDevServerConfig)
        ]);

        webpackConfig.entry.main.unshift(
            `webpack-dev-server/client?http://localhost:${webpackDevServerConfig.port}/`
        );

        return {
            webpackDevServerConfig,
            webpackConfig
        };
    }

    run() {
        this.validateParams();

        const WebpackDevServer = require('webpack-dev-server');
        const webpack = require('webpack');
        const {
            webpackConfig,
            webpackDevServerConfig
        } = this.setupWebpackConfig();

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
    }
}

module.exports = DevCommand;
