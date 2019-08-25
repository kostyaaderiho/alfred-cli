const path = require('path');

// you can use this file to add your custom webpack plugins, loaders and anything you like.
// This is just the basic way to add additional webpack configurations.
// For more information refer the docs: https://storybook.js.org/configurations/custom-webpack-config

// Export a function. Accept the base config as the only param.
module.exports = async ({ config, mode }) => {
    // `mode` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.

    // Make whatever fine-grained changes you need
    config.module.rules.push(
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
            test: /\.scss$/,
            use: ['style-loader', 'css-loader', 'sass-loader']
        }
    );

    config.resolve.alias['~'] = path.resolve(__dirname, './../src');

    // Return the altered config
    return config;
};
