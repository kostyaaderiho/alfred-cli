module.exports = cwd => {
    const path = require('path');
    const pathResolver = name => path.join(cwd, 'node_modules', name);
    const HtmlWebpackPlugin = require(pathResolver('html-webpack-plugin'));
    const { CleanWebpackPlugin } = require(pathResolver(
        'clean-webpack-plugin'
    ));
    const merge = require(pathResolver('webpack-merge'));
    const OptimizeCssAssetsPlugin = require(pathResolver(
        'optimize-css-assets-webpack-plugin'
    ));
    const globalHtmlTemplateSettings = {
        template: 'public/index.html',
        favicon: 'public/icon.png',
        hash: true
    };

    /**
     * Match all standalone entries.
     */
    const appEntries = [
        {
            applicationId: 'react_application',
            applicationTitle: 'React Applicaiton',
            filename: 'index.html'
        }
    ];

    /**
     * Creates entry html pages.
     */
    const HtmlWebpackPluginInstances = appEntries.map(
        entry =>
            new HtmlWebpackPlugin(
                Object.assign(entry, globalHtmlTemplateSettings)
            )
    );

    return merge([
        {
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
                ...HtmlWebpackPluginInstances,

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
        }
    ]);
};
