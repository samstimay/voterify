const env = process.env.NODE_ENV;
const isProd = process.env.NODE_ENV === "production"
var copy = require('recursive-copy');
var path = require("path");

const preConfig = function() {
    var src = path.join(__dirname, `/settings.${env}.json`);
    var dst = path.join(__dirname, `../public/settings.json`);
    copy(src, dst, {overwrite: true})
        .on(copy.events.COPY_FILE_COMPLETE, function(copyOperation) {
            console.info('Copied to ' + copyOperation.dest);
        })
        .catch(function(error) {
            return console.error('Copy failed: ' + error);
        });
}

module.exports = preConfig 