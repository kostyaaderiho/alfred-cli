const baseConfig = require('./webpack.config.base');
const merge = require('webpack-merge');

const devConfig = () => {
    return merge([{
        /**
         * Configure devServer for development;
         * 
         * Allows to turn on HMR during development, immidiatly see changes in a browser
         */
        devServer: {
            historyApiFallback: true,
            contentBase: 'client',
            port: 3000,
            open: true,
            hot: true
        }
    }]);
}

module.exports = env => {
    return merge(baseConfig(env), devConfig());
};
