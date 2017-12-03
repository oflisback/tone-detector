const { spawn } = require('child_process');
const streamSplitter = require('stream-splitter');
const events = require('events');

const MAX_ROLLOFF_DIFF = 4;

let sndpeekProcess = null;
let splitter = null;

module.exports = new events.EventEmitter();

module.exports.start = c => {
  const config = c || {};
  if (sndpeekProcess) {
    return new Error('A sndpeek process is already running.');
  }

  config.inputDevice = config.inputDevice || 0;
  config.sndpeekPath = config.sndpeekPath || 'sndpeek';
  config.maxToneCentroidOffset = config.maxToneCentroidOffset || 2;

  sndpeekProcess = spawn(config.sndpeekPath, ['--nodisplay', '--print', `--inputDevice:${config.inputDevice}`]);

  sndpeekProcess.on('exit', code => {
    module.exports.emit('error', new Error(`sndpeek process exited with code ${code}`));
  });

  sndpeekProcess.on('error', e => {
    module.exports.emit('error', e);
  });

  splitter = sndpeekProcess.stdout.pipe(streamSplitter('\n'));

  splitter.on('token', data => {
    const tokens = (`${data}`).split('  ');
    const value = {
      centroid: parseFloat(tokens[0]),
      rolloffLow: parseFloat(tokens[3]),
      rolloffHigh: parseFloat(tokens[4]),
    };

    // Simple check to see if the program initializes. Very specific numbers in that case.
    if (value.centroid === 256 || value.rolloffHigh === 511 || value.rolloffLow === 511) {
      return;
    }

    if (Math.abs(value.rolloffHigh - value.rolloffLow) > MAX_ROLLOFF_DIFF) {
      return;
    }
    if (config.targetToneCentroid &&
      Math.abs(value.centroid - config.targetToneCentroid) < config.maxToneCentroidOffset) {
      module.exports.emit('event', value);
    } else {
      module.exports.emit('event', value);
    }
  });
};

module.exports.stop = () => {
  if (!sndpeekProcess) {
    return new Error('There is no sndpeek process running to kill.');
  }
  sndpeekProcess.kill();
};
