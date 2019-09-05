const IGNORE_PATTERNS = ['/node_modules/', '<rootDir>/config', '.stryker-tmp'];

module.exports = {
    rootDir: '../',
    testMatch: ['**/src/**/*?(*.)+(spec|test).js'],
    moduleNameMapper: {
        '~(.*)$': '<rootDir>/src/$1',
        '\\.(md|jpg|png|svg|ttf|woff|woff2|svg|css|scss)$':
            '<rootDir>/config/mocks/file.mock.js'
    },
    testPathIgnorePatterns: IGNORE_PATTERNS,
    coveragePathIgnorePatterns: IGNORE_PATTERNS,
    coverageReporters: ['text', 'lcov']
};
