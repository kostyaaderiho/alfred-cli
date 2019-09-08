const fs = require('fs-extra');
const existsSync = require('exists-sync');
const Promise = require('rsvp');
const remove = Promise.denodeify(fs.remove);
const root = process.cwd();

module.exports.setup = function(path) {
    process.chdir(root);

    return remove(path).then(function() {
        fs.mkdirsSync(path);
    });
};
