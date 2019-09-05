/**
 * Default webpackDevServer proxy configuration.
 */
module.exports = {
    PROXY_TARGET_DEFAULT: 'https://localhost',
    PROXY_ENDPOINTS: [
        '/recognition-config-service',
        '/currency-service-app',
        '/cookie-banner-ui-app',
        '/client-service-app',
        '/storage-service-app',
        '/conversations',
        '/award-service',
        '/login-ui-app',
        '/nomination',
        '/global-nav',
        '/microsites',
        '/3rd-party',
        '/t_static',
        '/pictures',
        '/ec-api',
        '/award',
        '/pm',
        '/ws'
    ],
    DEFAULT_OPTIONS: {
        historyApiFallback: true,
        inline: true,
        port: 3000,
        open: true
    }
};
