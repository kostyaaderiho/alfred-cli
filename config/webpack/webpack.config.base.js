module.exports = (env, cwd) => {
    const path = require('path');
    const pathResolver = name => path.join(cwd, 'node_modules', name);
    const MiniCssExtractPlugin = require(pathResolver(
        'mini-css-extract-plugin'
    ));
    const HtmlWebpackPlugin = require(pathResolver('html-webpack-plugin'));
    const merge = require(pathResolver('webpack-merge'));
    const OptimizeCssAssetsPlugin = require(pathResolver(
        'optimize-css-assets-webpack-plugin'
    ));
    const webpack = require(pathResolver('webpack'));

    return merge([
        {
            /**
             * Entry application point
             */
            entry: {
                app: [path.resolve(cwd, 'src/app.js')]
            },

            /**
             * Bundle output configuration
             */
            output: {
                path: path.resolve(cwd, 'dist'),
                filename: '[name].bundle.js'
            },

            module: {
                rules: [
                    /**
                     * Babel loader in order to support ES6 features.
                     * A Babel 'ENV' preset can automatically determine the Babel plugins and polyfills you need
                     * based on your supported environments.
                     *
                     * See: https://webpack.js.org/loaders/babel-loader/
                     *      https://github.com/babel/babel-preset-env
                     */
                    {
                        test: /\.js$/,
                        exclude: /node_modules/,
                        use: [
                            {
                                loader: 'babel-loader'
                            }
                        ]
                    },
                    {
                        /**
                         * Pipeline for inserting CSS into the page
                         *
                         * Sass loader: compiles SASS to CSS, using Node Sass
                         * CSS loader: Translates CSS into CommonJS (interprets @import and url())
                         * Style loader: Creates style nodes from JS strings
                         */
                        test: /\.(sa|sc|c)ss$/,
                        use: [
                            env.ENVIRONMENT === 'production'
                                ? MiniCssExtractPlugin.loader
                                : 'style-loader',
                            'css-loader',
                            'sass-loader'
                        ]
                    },

                    /**
                     * File loader for supporting images, fonts, for example, in CSS files.
                     *
                     * See: https://webpack.js.org/loaders/file-loader/
                     */
                    {
                        test: /\.(woff|woff2|eot|ttf|otf|png|jpg|gif)$/,
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
                     * SVGO loader to optimize / minifie SVG file.
                     *
                     * See: https://github.com/kisenka/svg-sprite-loader
                     * See: https://github.com/rpominov/svgo-loader
                     */
                    {
                        test: /\.svg$/,
                        use: 'svg-sprite-loader'
                    }
                ]
            },

            resolve: {
                /**
                 * Define aliases
                 */
                alias: {
                    '~': path.resolve(__dirname, '..', 'src')
                }
            },

            plugins: [
                /*
                 * Plugin: HtmlWebpackPlugin
                 * Description: Simplifies creation of HTML files to serve your webpack bundles.
                 * This is especially useful for webpack bundles that include a hash in the filename
                 * which changes every compilation.
                 *
                 * See: https://github.com/ampedandwired/html-webpack-plugin
                 */
                new HtmlWebpackPlugin({
                    title: 'Awesome ReactJS app',
                    template: './src/index.html'
                }),

                /**
                 * Plugin: OptimizeCssAssetsPlugin
                 * Description: Minifies resulted CSS. Removes duplicated SCSS imports.
                 *
                 * See: https://github.com/NMFR/optimize-css-assets-webpack-plugin
                 */
                new OptimizeCssAssetsPlugin(),

                /**
                 * Plugin: DefinePlugin
                 *
                 * Description: Allows to define environment variables that can be used on client and server sides;
                 *
                 * See: https://webpack.js.org/plugins/define-plugin/
                 */
                new webpack.DefinePlugin({
                    ENVIRONMENT: JSON.stringify(process.env.ENVIRONMENT)
                })
            ]
        }
    ]);
};
