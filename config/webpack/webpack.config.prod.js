const path = require('path');

const prodConfig = cwd => {
    const pathResolver = name => path.join(cwd, 'node_modules', name);
    const OptimizeCssAssetsPlugin = require(pathResolver(
        'optimize-css-assets-webpack-plugin'
    ));
    const { LicenseWebpackPlugin } = require(pathResolver(
        'license-webpack-plugin'
    ));
    const MiniCssExtractPlugin = require(pathResolver(
        'mini-css-extract-plugin'
    ));
    const Visualizer = require(pathResolver('webpack-visualizer-plugin'));

    return {
        mode: 'production',

        plugins: [
            /**
             * Plugin: ExtractTextPlugin
             * Description: Extracts imported CSS files into external stylesheet
             *
             * See: https://webpack.js.org/plugins/extract-text-webpack-plugin/
             */
            new MiniCssExtractPlugin({ filename: '[name].css' }),

            /**
             * Plugin: OptimizeCssAssetsPlugin
             *
             * Description: Optimize output CSS file by minification
             *
             * See: https://github.com/NMFR/optimize-css-assets-webpack-plugin
             */
            new OptimizeCssAssetsPlugin(),

            /**
             * Plugin: Visualizer
             *
             * Description: Visualize and analyze output bundle
             *
             * See: https://github.com/chrisbateman/webpack-visualizer
             */
            new Visualizer({ filename: './statistics.html' }),

            /**
             * Plugin: LicenseWebpackPlugin
             * Description: finds all 3rd party libraries, and outputs the licenses in your webpack build directory.
             *
             * See: https://github.com/xz64/license-webpack-plugin
             */
            new LicenseWebpackPlugin({
                perChunkOutput: false
            })
        ]
    };
};

module.exports = (env, cwd) => {
    const baseConfig = require('./webpack.config.base');
    const merge = require(path.resolve(cwd, 'node_modules', 'webpack-merge'));

    return merge(baseConfig(env, cwd), prodConfig(cwd));
};
