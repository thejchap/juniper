# Juniper (Square Peg Round Hole LP2) Remix App

## App

### Overview

This is an single-page Javascript app that makes heavy use of the Web Audio API to allow visitors
to create their own remixes of songs from Square Peg Round Hole's album Juniper. The app is built on the Ember javascript framework.

Users can take the following actions with each sound:
- Mute/Unmute
- Reverse
- Control volume
- Add distortion
- Add a filter


### Audio

The app uses the Web Audio API (https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) to achieve the following:
- Schedule sample playback with solid timing
- Provide filters that the samples are routed through (distortion and low pass filter)
- Provide gain/volume controls and signal path


#### Transport
TODO

#### Controls

Ember 2's computed getters and setters make manipulating the various Web Audio properties very clean while also allowing other aspects of the app to monitor those values for changes (ie the position of the volume knob, changing the volume speaker icon based on how loud the sound is, etc)

Here is a very simple example with lots of code omitted:

```es6
// app/models/stem.js

import Ember from 'ember';
import DS from 'ember-data';
const { computed } = Ember;

export default DS.Model.extend({
  _volume: 0.75,
  
  volume: computed('_volume', {
    get() {
      return this.get('_volume');
    },
    
    set(_key, volume) {
      this.set('_volume', volume);
      
      // where this.get('audioGainNode') is a GainNode object
      this.set('audioGainNode.gain.value', volume);
      
      return volume;
    }
  })
});
```

### Persistence

Every change a user makes to a sound is stored in the URL so that users can share
their remixes without the app requiring any back-end database or persistent storage

#### URL encoding scheme

The final, encoded mix looks like this in the URL:

```
http://squarepegroundhole.me/#/?i=7-2_9-8_29&s=798bcd8a74
```

##### i parameter
The `i` parameter is an underscore-delimited series of pairs containing the IDs of the 'on' sounds, as well as
the length of that bulb's base-16 encoded 'state' string (these are all concatenated together and make up the `s` parameter.
This allows us to store information about each bulb's volume/distortion/etc and keep the query string as short as possible.

In this example: `5-3_7-3_9-6_23`
  - Sound 7 is on and has a 2 character state string
  - Sound 9 is on and has an 8 character state string
  - Sound 29 is on (nothing else has been manipulated on this sound so the 2nd number (and state string) is omitted)

##### s parameter
The `s` parameter is a group of base-16 encoded strings containing information about the changes made to each sound.
Because we know the length of each of these strings, we can break this parameter apart and decode the data for each
sound.

In this example:
```
         Sound 9
         |
[79][8bcd8a74]
  |
  Sound 7
```

Each string is then converted to base 10 and parsed out according to the following protocol (from left to right):
- __Number of properties manipulated__
  - 1 digit
  - Min: 1, max: 4
- __Which properties manipulated__
  - Number of digits = number from the first digit
  - Possible values:
    - 1 - `volume`
    - 2 - `isReversed`
    - 3 - `distortionAmount`
    - 4 - `filterFrequency`
- __Values of manipulated properties__
  - Number of digits = number of properties manipulated * length of each each property
    - `volume`
      - 2 digits
      - Min: 0, max: 99
    - `isReversed`
      - 1 digit
      - Min: 0, max: 1
    - `distortionAmount`
      - 2 digits
      - Min: 0, max: 99
    - `filterFrequency`
      - 5 digits
      - Min: 60, max: 19000

- In this example:
```
         Sound 9
         |
[79][8bcd8a74]
  |
  Sound 7

# Sound 7
- Original (Base 16): 79
- Decoded (Base 10): 121

    which property: isReversed
    |
[1][2][1]
 |     |
 |     property value: on
 |
 1 property has been manipulated

# Sound 9
- Original (Base 16): 8bcd8a74
- Decoded (Base 10): 2345503348

    which properties: distortionAmount, filterFrequency
    |
    |         filterFrequency: 03348 (3.348kHz)
    |         |
[2][34][55][03348]
 |      |
 |      distortionAmount: 55 (55%)
 |
 2 properties have been manipulated
```

## Prerequisites

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/) (with NPM)
* [Bower](http://bower.io/)
* [Ember CLI](http://www.ember-cli.com/)
* [PhantomJS](http://phantomjs.org/)

## Installation

* `git clone <repository-url>` this repository
* change into the new directory
* `npm install`
* `bower install`

## Running / Development

* `ember server`
* Visit your app at [http://localhost:4200](http://localhost:4200).


### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

### Running Tests

* `ember test`
* `ember test --server`

### Building

* `ember build` (development)
* `ember build --environment production` (production)


## Further Reading / Useful Links

* [ember.js](http://emberjs.com/)
* [ember-cli](http://www.ember-cli.com/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)

