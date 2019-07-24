const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const Visualizer = require('webpack-visualizer-plugin');
const baseConfig = require('./webpack.config.base');
const merge = require('webpack-merge');

const prodConfig = () => {
    return merge([
        {
            devtool: 'source-map',

            optimization: {

                /**
                 * Turn on tree-shaking for dead code
                 * 
                 * The "sideEffects" in package.json value should contains files that should not be removed during shaking
                 */
                usedExports: true,

                minimizer: [
                    /**
                     * Plugin: TerserPlugin
                     * Description: Minimize all JavaScript output of chunks.
                     *
                     * See: https://github.com/webpack-contrib/terser-webpack-plugin
                     */
                    new TerserPlugin({ sourceMap: true })
                ]
            },

            plugins: [
                /**
                 * Plugin: MiniCssExtractPlugin
                 * 
                 * Description: Helps with excracting output .css files
                 * 
                 * See: https://github.com/webpack-contrib/mini-css-extract-plugin
                 */
                new MiniCssExtractPlugin(),

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
                new Visualizer({ filename: './statistics.html' })
            ]
        }
    ])
}

module.exports = env => {
    return merge(baseConfig(env), prodConfig(env));
};