var spawn = require('child_process').spawn;
var streamSplitter = require("stream-splitter");
var events = require('events');
var sndpeekProcess = null;
var splitter = null;

module.exports = new events.EventEmitter();

function getBinaryName() {
    switch (process.platform) {
        case 'win32':
        case 'win64':
            return 'sndpeek.exe';
            break;
        case 'linux':
            return 'sndpeek-ubuntu';
            break;
        default:
            throw new Error('Platform ' + process.platform + ' currently not supported by sndpeek.');
            break;
    }
}

/**
 * Spawn the sndpeek binary and listen to output
 */
module.exports.startListening = function() {
    if (sndpeekProcess !== null) {
        console.log('sndpeek error: A sndpeek process is already running!');
        return;
    }

    sndpeekProcess = spawn('sndpeek', ['--nodisplay','--print']);

    sndpeekProcess.on('exit', function (code) {
        console.log('sndpeek process exited with code ' + code);
    });

    sndpeekProcess.on('error', function (error) {
        console.log('sndpeek could not start: ' + error);
    });

    splitter = sndpeekProcess.stdout.pipe(streamSplitter("\n"));

    splitter.on("token", function(token) {
        //We got one line of input
        token = ("" + token).split('  ');
        var values = {
            centroid: parseFloat(token[0]),
            flux: parseFloat(token[1]),
            rms: parseFloat(token[2]),
            rolloffLow: parseFloat(token[3]),
            rolloffHigh: parseFloat(token[4]),
            mffc: [
                parseFloat(token[5]),
                parseFloat(token[6]),
                parseFloat(token[7]),
                parseFloat(token[8]),
                parseFloat(token[9]),
                parseFloat(token[10]),
                parseFloat(token[11]),
                parseFloat(token[12]),
                parseFloat(token[13]),
                parseFloat(token[14]),
                parseFloat(token[15]),
                parseFloat(token[16]),
                parseFloat(token[17])
            ]
        };

        //Simple check to see if the program is initializes. Very specific numbers if the mic doesn't work!
        if (values.centroid != 256 && values.rolloffHigh != 511 && values.rolloffLow != 511) {
            module.exports.emit('data', values);
        }

    });
};

module.exports.stopListening = function() {
    if (sndpeekProcess === null) {
        console.log('sndpeek error: There is no sndpeek process running to kill');
        return;
    }
    sndpeekProcess.kill();
};
