// dependencies
import 'babel-polyfill';
import assert from 'assert';
import { rejects } from 'assert-exception';
import Itako from 'itako';

// target
import ItakoAudioReaderAudioElement from '../src';

// fixture
if (typeof global.Audio === 'undefined') {
  global.Audio = require('mock-audio-element');
}
const audioTransformer = {
  transform(tokens) {
    return tokens.map(token => token.setType('audio'));
  },
};

// specs
describe('itako-audio-reader-audio-element', () => {
  it('should ignore the non-audio token', async() => {
    const reader = new ItakoAudioReaderAudioElement;
    const itako = new Itako([reader]);
    const reason = await rejects(itako.read('foo'));

    assert(reason.message === 'unexpected token "text:foo"');
  });

  it('should read the audio token as an audio file', async () => {
    const reader = new ItakoAudioReaderAudioElement;
    const itako = new Itako([reader], [audioTransformer]);

    const text = 'http://static.edgy.black/beep.mp3';
    const tokens = await itako.read(text);
    assert(tokens[0].meta.reader.name === 'audio-element');
    assert(tokens[0].value === text);
  });

  it('if specify volume/pitch option, it should be change the volume and pitch', async() => {
    const reader = new ItakoAudioReaderAudioElement;
    const itako = new Itako([reader], [audioTransformer]);

    const text = 'http://static.edgy.black/beep.mp3';
    const tokens = await itako.read(text, { volume: 0.2, pitch: 0.5 });
    assert(tokens[0].meta.reader.name === 'audio-element');
    assert(tokens[0].meta.audio.volume === 0.2);
    assert(tokens[0].meta.audio.playbackRate === 0.5);
    assert(tokens[0].value === text);
  });
});
