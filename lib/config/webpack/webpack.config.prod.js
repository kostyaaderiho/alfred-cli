module.exports = (env, cwd) => {
    const { LicenseWebpackPlugin } = require('license-webpack-plugin');
    const MiniCssExtractPlugin = require('mini-css-extract-plugin');
    const baseConfig = require('./webpack.config.base');
    const merge = require('webpack-merge');

    const webpackProductionConfig = {
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

    return merge([baseConfig(env, cwd), webpackProductionConfig]);
};
