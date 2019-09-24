const fs = require('fs-extra');
const root = process.cwd();

module.exports.setup = function(path) {
    process.chdir(root);
    return fs.remove(path).then(function() {
        fs.mkdirsSync(path);
    });
};
