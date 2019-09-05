const path = require('path');
const fs = require('fs');

/**
 * Initiate instance for HTMLWebpabpackPlugin
 *
 * @param {string} cwd Current work directory
 */
function initWebpackHTMLPluginInstance(cwd) {
    const HtmlWebpackPlugin = require('html-webpack-plugin');
    const projectCLIFileURL = path.resolve(cwd, 'alfred.json');
    const CLIDefaultFile = require(path.resolve(
        __dirname,
        'htmlWebpackInstance.js'
    ));
    const { globalHtmlTemplateSettings } = CLIDefaultFile;
    let appEntry = {};

    /**
     * Check existing alfred.json file in installed project dir.
     *
     * Prepare app entry based on project configuration or otherwise use default settings.
     */
    if (fs.existsSync(projectCLIFileURL)) {
        let projectCLIOptions = JSON.parse(
            fs.readFileSync(projectCLIFileURL, 'utf8')
        );
        appEntry = {
            applicationId: projectCLIOptions.id,
            applicationTitle: projectCLIOptions.title,
            applicationContent: projectCLIOptions.description
        };
    } else {
        appEntry = CLIDefaultFile.appEntry;
    }

    return new HtmlWebpackPlugin(
        Object.assign(appEntry, globalHtmlTemplateSettings)
    );
}

/**
 * Check if there is custom base config in target project.
 *
 * @param {string} cwd Current working directory.
 */
function getUserWebpackBaseConfig(cwd) {
    const userCustomWebpckConfigURL = path.resolve(
        cwd,
        'config/webpack.config.base.js'
    );

    if (fs.existsSync(userCustomWebpckConfigURL)) {
        return require(userCustomWebpckConfigURL);
    }

    return {};
}

module.exports = cwd => {
    const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
    const { CleanWebpackPlugin } = require('clean-webpack-plugin');
    const merge = require('webpack-merge');
    const DEFAULT_BASE_CONFIG = {
        /**
         * Entry application point
         */
        entry: {
            main: [path.resolve(cwd, './src/index.js')]
        },

        /**
         * Bundle output configuration
         */
        output: {
            path: path.resolve(cwd, 'dist')
        },

        module: {
            rules: [
                /**
                 * Babel loader in order to support ES6 features.
                 *
                 * @see https://webpack.js.org/loaders/babel-loader/
                 */
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader'
                    }
                },

                /**
                 * File loader for supporting images, fonts, for example, in CSS files.
                 *
                 * @see https://webpack.js.org/loaders/file-loader/
                 */
                {
                    test: /\.(woff|woff2|png|jpg)$/,
                    use: {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[hash].[ext]'
                        }
                    }
                },

                /**
                 * SVG loader for supporting svg, for example, in CSS/HTML files.
                 * Generates sprite from required SVG files.
                 *
                 * @see https://github.com/kisenka/svg-sprite-loader
                 * @see https://github.com/rpominov/svgo-loader
                 */
                {
                    test: /\.svg$/,
                    use: 'svg-sprite-loader'
                }
            ]
        },

        resolve: {
            alias: {
                '~': path.resolve(cwd, 'src')
            }
        },

        plugins: [
            /*
             * Plugin: HtmlWebpackPlugin
             * Description: Simplifies creation of HTML files to serve your webpack bundles.
             * This is especially useful for webpack bundles that include a hash in the filename
             * which changes every compilation.
             *
             * @see https://github.com/ampedandwired/html-webpack-plugin
             */
            initWebpackHTMLPluginInstance(cwd),

            /**
             * Plugin: OptimizeCssAssetsPlugin
             * Description: Minifies resulted CSS. Removes duplicated SCSS imports.
             *
             * @see https://github.com/NMFR/optimize-css-assets-webpack-plugin
             */
            new OptimizeCssAssetsPlugin(),

            /**
             * All files inside webpack's output.path directory will be removed once, but the
             * directory itself will not be. If using webpack 4+'s default configuration,
             * everything under <PROJECT_DIR>/dist/ will be removed.
             * Use cleanOnceBeforeBuildPatterns to override this behavior.
             *
             * During rebuilds, all webpack assets that are not used anymore
             * will be removed automatically.
             *
             * @see https://github.com/johnagan/clean-webpack-plugin
             */
            new CleanWebpackPlugin()
        ]
    };

    /**
     * The custom user config has a priority under the DEFAULT_BASE_CONFIG config.
     *
     * If there is a conflict between fields, user's config field will be choosen if its not possible to merge.
     */
    return merge([getUserWebpackBaseConfig(cwd), DEFAULT_BASE_CONFIG]);
};
