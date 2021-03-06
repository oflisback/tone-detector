# Tone detector

Simple library used to detect specific tones in audio input (e.g. from a microphone). For instance it can be used to trigger something when whisteling a certain tone or when an alarm goes off.

The detector uses [sndpeek](http://www.gewang.com/software/sndpeek/) for audio input and feature extraction. Inspired and partly based on [RobQuistNL](https://github.com/RobQuistNL)'s [node-sndpeek](https://github.com/RobQuistNL/node-sndpeek). Tested on arch linux but may work on macOS and Windows too.

# Installation


```
npm install tone-generator
```

## Dependencies

Sndpeek must be installed.

### Arch Linux

Install [sndpeek-alsa](https://aur.archlinux.org/packages/sndpeek-alsa/) using your favorite package manager.

### Other Linux

Install from source available [here](http://www.gewang.com/software/sndpeek/). RobQuistNL also distributes a binary built for ubuntu [here](https://github.com/RobQuistNL/node-sndpeek/blob/master/bin/sndpeek-ubuntu).

### MacOs and Windows

Download the executable from [here](http://www.gewang.com/software/sndpeek/).

# Usage

See the [examples](https://github.com/oflisback/tone-detector/tree/master/examples) directory for two examples. One to report all detected tones and one to detect a specific tone.

After cloning this repository and running:

```
npm install
```

The examples can be executed through:

```
npm run report
```

and

```
npm run detect
```


Use report to identify the characteristics of a tone you want to detect, then use that information to configure detect to detect that specific tone.

Detection is started by calling the start function which takes an optional config object as parameter:

```
{
  inputDevice // number identifying audio input device to use (default: 0)
  sndpeekPath // path to the sndpeek executable (default: 'sndpeek')
  maxToneCentroidOffset // maximum difference between detected tone and target tone to still consider it a match (default: 2)
  targetToneCentroid: // Target tone (default: undefined)
}
```

Here's a minimal usage example where the config object is omitted:

```
const detector = require('tone-detector');

detector.on('event', e => console.log(e));

detector.start();
```

# License

This project is licensed under the MIT License - see the LICENSE.md file for details
