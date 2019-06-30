module.exports = {
    setupFiles: ['<rootDir>/tests/setup.js'],
    collectCoverage: true,
    coverageReporters: ['json', 'html'],
    testPathIgnorePatterns: ['<rootDir>/cypress'],
    snapshotSerializers: ['enzyme-to-json/serializer'],
    moduleFileExtensions: ['js', 'jsx'],
    moduleDirectories: ['node_modules'],
    moduleNameMapper: {
        '^components(.*)$': '<rootDir>/src/components$1',
        '^shared(.*)$': '<rootDir>/src/shared$1',
        '^pages(.*)$': '<rootDir>/src/pages$1',
        '^store(.*)$': '<rootDir>/src/store$1',
        '^utils(.*)$': '<rootDir>/src/utils$1',
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
            '<rootDir>/__mocks__/fileMock.js',
        '\\.(css|scss)$': '<rootDir>/__mocks__/styleMock.js'
    }
};
