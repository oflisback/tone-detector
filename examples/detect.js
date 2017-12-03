const listener = require('../');

listener.on('report', tone => {
  console.log(`Target tone detected! [Centroid RolloffLow RolloffHigh]: [${tone.centroid} ${tone.rolloffLow} ${tone.rolloffHigh}]`);
});

listener.on('error', e => console.log(e));

const config = {
  maxToneCentroidOffset: 5,
  sndpeekPath: '/usr/bin/sndpeek',
  targetToneCentroid: 30,
};

const err = listener.start(config);
if (err) {
  console.log(err);
  process.exit(-1);
}

console.log(`Listening for tone with centroid ${config.targetToneCentroid} ...`);
