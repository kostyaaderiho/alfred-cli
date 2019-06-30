const ReactLoadablePlugin = require('react-loadable/webpack').ReactLoadablePlugin;
const WebpackAssetsManifest = require('webpack-assets-manifest');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const htmlWebpackPlugin = require('html-webpack-plugin');
const merge = require("webpack-merge");
const webpack = require('webpack');
const path = require('path');

const aliasEntries = [
    'components', 
    'shared', 
    'pages', 
    'utils', 
    'store',
    'hoc',
    'api'
];

const defineAlias = entries => {
    const aliases = {};

    entries.forEach(entry => {
        aliases[entry] = path.resolve(__dirname, `../src/${entry}`);
    });
 
    return aliases;
}

module.exports = env => {
    return merge([{
        /**
         * Entry application point
         */
        entry: {
            app: './src/index.js'
        },

        /**
         * Bundle output configuration
         */
        output: {
            path: path.resolve(__dirname, '../../dist'),
            filename: '[name].bundle.js'
        },

        module: {
            rules: [
                /**
                 * Define loader for .js files
                 * 
                 * Transpile .js files by babel using preset-env/preset-react
                 * Allowed to use class properties and HMR during development
                 */
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use:[{
                        loader: "babel-loader"
                    }]
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
                        env.ENVIRONMENT === 'production' ? MiniCssExtractPlugin.loader : "style-loader",
                        "css-loader",
                        "sass-loader"
                    ]
                },

                /**
                 * File loader
                 * 
                 * This will emit file.[extension] as a file in the output directory and returns the public URI of the file
                 * 
                 * See: https://www.npmjs.com/package/file-loader
                 */
                {
                    test: /\.(png|svg|jpg|gif)$/,
                    use: {
                        loader: 'file-loader'
                    }
                }
            ]
        },

        resolve: {
            /**
             * Define aliases
             * 
             * Output represented as an object with the following fields: [aliasName]: aliasPath
             */
            alias: defineAlias(aliasEntries)
        },

        plugins: [
            /**
             * Plugin: HTMLWebpackPlugin
             * 
             * Description: Simplifies creation of HTML files to serve your webpack bundles
             * 
             * See: https://webpack.js.org/plugins/html-webpack-plugin/
             */
            new htmlWebpackPlugin({
                title: 'ReactJS global mentoring application.',
                template: "./src/index.html"
            }),


            /**
             * Plugin: DefinePlugin
             * 
             * Description: Allows to define environment variables that can be used on client and server sides;
             * 
             * See: https://webpack.js.org/plugins/define-plugin/
             */
            new webpack.DefinePlugin({
                'ENVIRONMENT': JSON.stringify(process.env.ENVIRONMENT)
            }),

            new ReactLoadablePlugin({
                filename: path.resolve(__dirname, '../../dist/react-loadable.json'),
            }),

            new WebpackAssetsManifest({})
        ]
    }]);
};
