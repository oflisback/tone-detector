var sndpeek = require('./sndpeek.js');

sndpeek.startListening();
console.log('started listening');

sndpeek.on('data', function(data) {
    var maxDiff = 4;
    var diff = data.rolloffHigh - data.rolloffLow;
    if (diff <= maxDiff && diff >= -maxDiff) {
        console.log('Whistle detected! - Rolloff:');
        console.log('High: ' + data.rolloffHigh + "Low: " + data.rolloffLow +
            " Diff: " + (diff));
    }
});
