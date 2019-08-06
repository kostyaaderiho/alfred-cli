module.exports = (cwd, env, devServer) => {
    const path = require('path');
    const WebpackNotifierPlugin = require(path.resolve(
        cwd,
        'node_modules',
        'webpack-notifier'
    ));
    const webpack = require(path.resolve(cwd, 'node_modules', 'webpack'));

    return {
        mode: 'development',
        devtool: 'source-map',

        module: {
            rules: [
                /**
                 * Extracts existing source maps from all JavaScript entries.
                 * This includes both inline source maps as well as those linked via URL.
                 *
                 * @see https://github.com/webpack-contrib/source-map-loader
                 */
                {
                    test: /\.js$/,
                    use: ['source-map-loader']
                },

                /**
                 * Rules to support SASS pre-processor.
                 *
                 * Add ability to import CSS from JS code.
                 * CSS will be injected automatically to DOM using <style> tag.
                 *
                 * @see https://webpack.js.org/loaders/css-loader/
                 * @see https://webpack.js.org/loaders/style-loader/
                 * @see https://webpack.js.org/loaders/sass-loader/
                 */
                {
                    test: /\.(scss|css)$/,
                    use: [
                        'style-loader',
                        {
                            loader: 'css-loader',
                            options: { sourceMap: true }
                        },
                        {
                            loader: 'sass-loader',
                            options: { sourceMap: true }
                        }
                    ]
                }
            ]
        },

        plugins: [
            /**
             * The plugin will notify you about the first run (success/fail),
             * all failed runs and the first successful run after recovering
             * from a build failure. In other words: it will stay silent
             * if everything is fine with your build.
             *
             * @see https://github.com/Turbo87/webpack-notifier
             */
            new WebpackNotifierPlugin(),
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(env.NODE_ENV)
            })
        ],

        devServer
    };
};
