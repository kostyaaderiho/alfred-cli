module.exports = (env, cwd) => {
    const path = require('path');
    const baseConfig = require('./webpack.config.base');
    const merge = require(path.resolve(cwd, 'node_modules', 'webpack-merge'));

    return merge(
        baseConfig(env, cwd),
        (cwd => {
            const pathResolver = name => path.join(cwd, 'node_modules', name);
            const { LicenseWebpackPlugin } = require(pathResolver(
                'license-webpack-plugin'
            ));
            const MiniCssExtractPlugin = require(pathResolver(
                'mini-css-extract-plugin'
            ));

            return {
                mode: 'production',

                module: {
                    rules: [
                        /**
                         * Extract and compile SCSS files to external CSS file
                         *
                         * @see https://webpack.js.org/loaders/sass-loader/#in-production
                         */
                        {
                            test: /\.(scss|css)$/,
                            use: [
                                MiniCssExtractPlugin.loader,
                                'css-loader',
                                'sass-loader'
                            ]
                        }
                    ]
                },

                plugins: [
                    /**
                     * Plugin: ExtractTextPlugin
                     * Description: Extracts imported CSS files into external stylesheet
                     *
                     * @see: https://webpack.js.org/plugins/extract-text-webpack-plugin/
                     */
                    new MiniCssExtractPlugin({ filename: '[name].css' }),

                    /**
                     * Plugin: LicenseWebpackPlugin
                     * Description: finds all 3rd party libraries, and outputs the licenses in your webpack build directory.
                     *
                     * @see https://github.com/xz64/license-webpack-plugin
                     */
                    new LicenseWebpackPlugin({
                        perChunkOutput: false
                    })
                ]
            };
        })(cwd)
    );
};
