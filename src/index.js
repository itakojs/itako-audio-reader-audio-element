// dependencies
import Promise from 'bluebird';

// @class ItakoAudioReaderAudioElement
export default class ItakoAudioReaderAudioElement {
  /**
  * @constructor
  * @param {string} type - a target token type
  * @param {object} [options={}] - a token default options
  */
  constructor(type = 'audio', options = {}) {
    this.name = 'audio-element';
    this.type = type;
    this.opts = {
      volume: 1,
      pitch: 1,
      ...options,
    };

    this.enableAudioElement();

    this.audios = [];
  }

  /**
  * monky patching for iOS (untested)
  * @see http://qiita.com/uupaa/items/e5856e3cb2a9fc8c5507
  * @see https://github.com/beraboume/nicolive.berabou.me/blob/master/app/services/sound-enabler.coffee
  * @returns {undefined}
  */
  enableAudioElement() {
    if (typeof window === 'undefined') {
      return;
    }

    window.addEventListener('touchstart', function enable() {
      window.removeEventListener('touchstart', enable);

      // use brfs/transform-loader (see https://github.com/webpack/transform-loader#readme)
      const buffer = require('fs').readFileSync(`${__dirname}/sound-enabler.mp3`);
      this.play(`data:audio/mpeg;base64,${buffer.toString('base64')}`);
    });
  }

  /**
  * @method read
  * @param {token} token - a itako-token instance
  * @returns {promise|token} - returns the promise only when reading
  */
  read(token) {
    if (token.type !== this.type) {
      return token;
    }

    return this.play(token.value.url || token.value, token.options)
    .then((audio) => token.setMeta('audio', audio));
  }

  /**
  * @method play
  * @param {url} url - an audio url
  * @param {object} [options={}] - a gain/playbackRate options
  * @returns {promise} - returns the used nodes after playing
  */
  play(url, options = {}) {
    return new Promise((resolve) => {
      const audio = new Audio;
      audio.src = url;
      audio.volume = options.volume || 1;
      audio.playbackRate = options.pitch || options.speed || 1;
      audio.play();
      audio.addEventListener('ended', () => {
        const index = this.audios.indexOf(audio);
        if (index > -1) {
          this.audios.splice(index, 1);
        }

        resolve(audio);
      });

      this.audios.push(audio);
    });
  }
}
