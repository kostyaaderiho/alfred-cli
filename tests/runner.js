const Mocha = require('mocha');
const glob = require('glob');
const RSVP = require('rsvp');

/**
 * Mocha run test method.
 */
function runMocha() {
    let root = 'tests/{unit,e2e,acceptance}';
    let testFiles = glob.sync(`${root}/**/*.test.js`);
    let mocha = new Mocha({
        timeout: 5000,
        retries: 1
    });
    let files =
        typeof testFiles === 'string' ? glob.sync(root + testFiles) : testFiles;
    files.forEach(mocha.addFile.bind(mocha));

    console.time('CLI tests running time');
    mocha.run(failures => {
        console.timeEnd('CLI tests running time');
        process.exit(failures);
    });
}

RSVP.resolve()
    .then(() => runMocha())
    .catch(error => {
        console.error(error);
        console.error(error.stack);
        process.exit(1);
    });
