import Ember from 'ember';
import Stem from 'juniper/models/stem';
const { inject, run } = Ember;

export default Ember.Route.extend({
  tour: inject.service(),

  metrics: inject.service(),

  notify: inject.service(),

  queryParams: {
    stemData: {
      refreshModel: true
    },

    ids: {
      refreshModel: true
    }
  },

  beforeModel() {
    if (!Modernizr.webaudio || !Modernizr.cssanimations) {
      this.transitionTo('unsupported');
    }
  },

  model(params) {
    const loadStems = this.store.findAll('stem');
    const meta = Stem.urlDecodeIds(params.ids);
    const stemData = Stem.urlDecodeData(params.stemData, meta);
    const ids = meta.mapBy('id');

    return loadStems.then((stems) => {
      return Stem.applyUrlData(stems, ids, stemData, this.store);
    });
  },

  renderTemplate() {
    this._super();

    this.send('showModal', 'modals/loading', this.get('currentModel').getEach('bufferQueue'));
  },

  setupController(controller, model) {
    this._super(controller, model);
    const transport = controller.get('transport');
    const loadAudio = Promise.all(model.invoke('loadAudio'));
    transport.set('stems', model);
    this._initTour();
    loadAudio.then(() => {
      if (this.get('controller.stemData') === null && this.get('controller.ids') === '8') {
        run.next(() => this.get('tour').start());
      } else {
        this.get('controller.transport').send('play');
      }
    });
  },

  _initTour() {
    let tour = this.get('tour');

    tour.set('defaults', {
      classes: 'shepherd-element shepherd-open shepherd-theme-dark shepherd-theme-arrows-plain-buttons',
      scrollTo: false,
      showCancelLink: true
    });

    tour.set('modal', true);

    tour.on('complete', () => {
      this.get('controller.transport').send('play');

      this.get('metrics').trackEvent({
        category: 'Tour',
        action: 'Complete'
      });
    });

    tour.on('cancel', () => {
      this.get('controller.transport').send('play');

      this.get('metrics').trackEvent({
        category: 'Tour',
        action: 'Cancel'
      });
    });

    tour.set('steps', [{
      id: 'welcome',
      options: {
        attachTo: 'body',
        title: 'Welcome to Juniper',
        showCancelLink: false,
        text: [
          'This website allows you to create your own remixes of songs from Square Peg Round Hole\'s upcoming album, <strong>Juniper</strong>.',
          'For best results, please use <strong>Google Chrome</strong> as your web browser when creating your remixes.'
        ],
        builtInButtons: [{
          classes: 'shepherd-button-secondary',
          text: 'Close',
          type: 'cancel'
        }, {
          classes: 'shepherd-button-primary',
          text: 'Next',
          type: 'next'
        }]
      }
    }, {
      id: 'bulbs',
      options: {
        attachTo: 'body',
        title: 'Lightbulbs',
        showCancelLink: false,
        text: [
          'Each <strong>lightbulb</strong> represents an individual audio track from a song on Juniper.',
          '<strong>Click</strong> a lightbulb to <strong>mute</strong> or <strong>unmute</strong> a track.',
          '<strong>Hover</strong> over a lightbulb and select an icon to tweak the sound\'s effects, such as <strong>distortion, filter, reverse, and volume</strong>.'
        ],
        builtInButtons: [{
          classes: 'shepherd-button-secondary',
          text: 'Close',
          type: 'cancel'
        }, {
          classes: 'shepherd-button-secondary',
          text: 'Back',
          type: 'back'
        }, {
          classes: 'shepherd-button-primary',
          text: 'Next',
          type: 'next'
        }]
      }
    }, {
      id: 'share',
      options: {
        attachTo: 'body',
        title: 'Share',
        text: ['Share your remixes with your friends and followers on <strong>Facebook</strong> and <strong>Twitter</strong>, or by <strong>Email</strong>.'],
        showCancelLink: false,
        builtInButtons: [{
          classes: 'shepherd-button-secondary',
          text: 'Back',
          type: 'back'
        }, {
          classes: 'shepherd-button-primary',
          text: 'Start',
          type: 'next'
        }]
      }
    }]);
  },

  _resetMix() {
    this.transitionTo({ queryParams: { stemData: null, ids: '8' } });
    this.get('notify').success('Remix reset');
  },

  actions: {
    toggleStem(stem) {
      stem.toggleProperty('on');
    },

    showShareModal() {
      this.send('showModal', 'modals/share');
    },

    startTour() {
      this.get('tour').start();

      this.get('metrics').trackEvent({
        category: 'Tour',
        action: 'Manual Start'
      });
    },

    resetMix() {
      this.get('metrics').trackEvent({
        category: 'Transport',
        action: 'Reset - Clicked'
      });

      if (window.confirm('Are you sure you want to reset your mix? You will lose all of your changes')) {
        this.get('metrics').trackEvent({
          category: 'Transport',
          action: 'Reset - Confirmed'
        });

        this._resetMix();
      } else {
        this.get('metrics').trackEvent({
          category: 'Transport',
          action: 'Reset - Canceled'
        });
      }
    },

    updateUrl() {
      const stems = this.get('controller.onStems');
      const ids = Stem.urlEncodeIds(stems);
      const stemData = Stem.urlEncodeData(stems);
      let queryParams = { stemData, ids };
      this.transitionTo({ queryParams });
    }
  }
});
