# Square Peg Round Hole - Juniper (LP)

## App

### Overview

This is an single-page Javascript app that makes heavy use of the Web Audio API to allow visitors
to create their own remixes of songs from Square Peg Round Hole's album Juniper.

Users can take the following actions with each sound:
- Mute/Unmute
- Reverse
- Control volume
- Add distortion
- Add a filter

### Persistence

Every change a user makes to a sound is stored in the URL so that users can share
their remixes without the app requiring any back-end database or persistent storage

#### URL encoding scheme

The final, encoded mix looks like this in the URL:

```
http://squarepegroundhole.me/#/?i=01100216031704740405&s=9007199254740991
```

- `i` parameter is a set of digits containing metadata about which sounds (stems) have been manipulated,
and how long each of their base-16 encoded 'state' strings is. The actual state of each bulb is then stored in the `state`param.
For example, in the above URL:
  - stem 1's encoded state is 10 characters long
  - stem 2's encoded state is 16 characters long
  - stem 3's encoded state is 14 characters long

- `s` parameter is a group of strings concatenated together, each of which represents the state of a particular
stem referenced in the `i` parameter

The hex string is decoded to an integer that adheres to the following format:

```
[3][153][75][36][00421]
 |   |    |
 |   |    |
 |   |    Value of volume parameter
 |   |
 |   Which parameters are being persisted, if less than 4 (1 = reverse, 2 = volume, 3 = filter, 4 = distortion)
 |
 How many parameters are being persisted (0-4)
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

