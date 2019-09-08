const captureExit = require('capture-exit');
captureExit.captureExit();

const glob = require('glob');
const Mocha = require('mocha');
const RSVP = require('rsvp');

let root = 'tests/{unit,e2e,acceptance}';
let mocha = new Mocha({
    timeout: 5000,
    retries: 1
});
let testFiles = glob.sync(`${root}/**/*.test.js`);

function addFiles(mocha, files) {
    files = typeof files === 'string' ? glob.sync(root + files) : files;
    files.forEach(mocha.addFile.bind(mocha));
}

function runMocha() {
    console.time('CLI tests running time');

    addFiles(mocha, testFiles);

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
