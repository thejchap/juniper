import Ember from 'ember';
import ENV from 'sprh-bulbs/config/environment';
const { computed } = Ember;

export default Ember.Controller.extend({
  stems: [],

  lookahead: 25.0,

  scheduleAheadTime: 0.1,

  nextNoteTime: 0.0,

  current16thNote: null,

  currentBar: null,

  tempo: ENV.APP.TEMPO,

  worker: null,

  audioContext: null,

  isPlaying: false,

  secondsPerBeat: computed('tempo', function() {
    return 60.0 / this.get('tempo');
  }),

  init() {
    this.set('worker', this._makeWorker());
  },

  _scheduleNote(beatNumber, time) {
    if (this.get('currentBar') !== 0 || beatNumber !== 0) {
      return;
    }

    this.get('stems').invoke('play', time, time + (this.get('secondsPerBeat') * 18));
  },

  _nextNote() {
    this.incrementProperty('nextNoteTime', 0.25 * this.get('secondsPerBeat'));
    this.incrementProperty('current16thNote');

    if (this.get('current16thNote') === 16) {
      this.set('current16thNote', 0);
      this.incrementProperty('currentBar');
    }

    if (this.get('currentBar') === 4) {
      this.set('currentBar', 0);
    }
  },

  _schedule() {
    const condition = () => {
      const [next, cur, sched] = [
        this.get('nextNoteTime'),
        this.get('audioContext.currentTime'),
        this.get('scheduleAheadTime')
      ];

      return next < cur + sched;
    };

    while (condition()) {
      this._scheduleNote(this.get('current16thNote'), this.get('nextNoteTime'));
      this._nextNote();
    }
  },

  _makeWorker() {
    const worker = new Worker('./workers/worker-metronome.js');

    worker.onmessage = (msg) => {
      if (msg.data !== 'tick') {
        return;
      }

      this._schedule();
    };

    worker.postMessage({
      interval: this.get('lookahead')
    });

    return worker;
  },

  actions: {
    play() {
      this.set('isPlaying', true);
      this.set('current16thNote', 0);
      this.set('currentBar', 0);
      this.set('nextNoteTime', this.get('audioContext.currentTime'));
      this.get('worker').postMessage('start');
    },

    stop() {
      this.set('isPlaying', false);
      this.get('worker').postMessage('stop');
    }
  }
});
