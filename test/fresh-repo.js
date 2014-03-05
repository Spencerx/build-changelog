var parallel = require('continuable-para');
var fs = require('fs');
        parallel({
            log: exec.bind(null, 'git log --oneline', {
                cwd: folder
            }),
            diff: exec.bind(null, 'git diff HEAD~1 -- CHANGELOG', {
                cwd: folder
            }),
            diff2: exec.bind(null, 'git diff HEAD~1 -- package.json', {
                cwd: folder
            }),
            package: fs.readFile.bind(null, path.join(folder, 'package.json')),
            changelog: readChangelog.bind(null, path.join(folder, 'CHANGELOG'))
        }, function (err, data) {

            var changelog = data.changelog;
            var diff = data.diff;
            var log = data.log;

            var logLines = log.trim().split('\n');
            assert.equal(logLines.length, 2);
            assert.notEqual(logLines[0].indexOf('0.2.0'), -1);
            assert.notEqual(logLines[1].indexOf('initial commit'), -1);

            assert.notEqual(diff.indexOf('new file mode'), -1);

            assert.equal(
                JSON.parse(String(data.package)).version,
                '0.2.0');

            assert.notEqual(data.diff2.indexOf('0.2.0'), -1);

        });