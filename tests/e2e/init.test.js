const alfred = require('../helpers/alfred');
const walkSync = require('walk-sync');
const tmp = require('../helpers/tmp');
const fsExtra = require('fs-extra');
const EOL = require('os').EOL;
const util = require('util');
const path = require('path');

const chai = require('../helpers/chai');
const root = process.cwd();
const expect = chai.expect;

const tmpProjectName = 'my-test-project';
const tmpPath = `./tmp/init-test`;

function confirmBlueprinted(tmpFolder) {
    let blueprintPath = path.join(root, 'blueprints', 'app', 'files');
    let expected = walkSync(blueprintPath).sort();
    let actual = walkSync(path.resolve(tmpFolder)).sort();

    expect(expected).to.deep.equal(
        actual,
        `${EOL} expected: ${util.inspect(
            expected
        )}${EOL} but got: ${util.inspect(actual)}`
    );
}

describe('Command: alfred init', function() {
    beforeEach(async function() {
        await tmp.setup(tmpPath);
        process.chdir(tmpPath);
    });

    afterEach(() => {
        fsExtra.removeSync(path.resolve(tmpProjectName));
    });

    it('Basic init', async function() {
        await alfred([
            'init',
            tmpProjectName,
            '--skip-install',
            '--skip-prompt'
        ]);
        confirmBlueprinted(tmpProjectName);
    });
});
