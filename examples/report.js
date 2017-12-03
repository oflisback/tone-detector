const listener = require('../');

listener.on('event', tone => {
  console.log(`Tone detected! [Centroid RolloffLow RolloffHigh]: [${tone.centroid} ${tone.rolloffLow} ${tone.rolloffHigh}]`);
});

listener.on('error', e => console.log(e));

const config = {
  sndpeekPath: '/usr/bin/sndpeek',
};

const err = listener.start(config);
if (err) {
  console.log(err);
  process.exit(-1);
}

console.log('Listening for tones ...');
