import Ember from 'ember';

export default Ember.Mixin.create({
  PERSISTENT_PROPS: {
    volume: {
      id: 1,
      length: 2
    },

    isReversed: {
      id: 2,
      length: 1
    },

    distortionAmount: {
      id: 3,
      length: 2
    },

    filterFrequency: {
      id: 4,
      length: 5
    }
  },

  urlEncodeIds(collection) {
    if (!collection.get('length')) {
      return null;
    }

    let len;
    let str = '';

    collection.forEach((record) => {
      len = (record.get('encodedState.length') || 0).toString();

      if (len > 0) {
        str = `${str}${record.get('id')}-${len}_`;
      } else {
        str = `${str}${record.get('id')}_`;
      }
    });

    str = str.replace(/_$/, '');
    return str;
  },

  urlDecodeIds(str) {
    if (!str) {
      return [];
    }

    const tuples = str.split('_');

    let id;
    let len;
    let result = [];

    tuples.forEach((tuple) => {
      [id, len] = tuple.split('-');

      result.push({
        id: parseInt(id, 10),
        encodedStateLength: len ? parseInt(len, 10) : 0
      });
    });

    return result;
  },

  urlEncodeData(collection) {
    const states = collection.mapBy('encodedState').compact();

    if (!states.get('length')) {
      return null;
    }

    return states.join('');
  },

  urlDecodeData(str, meta) {
    if (!str) {
      return;
    }

    let i = 0;
    let j = 0;
    let chunk;
    let decodedChunk;
    let numProps;
    let whichEnd;
    let whichProps;
    let propsData;
    let result = {};
    let prop;
    let propData;

    const props = Object.keys(this.PERSISTENT_PROPS).map((k) => ({
      name: k,
      id: this.PERSISTENT_PROPS[k].id,
      length: this.PERSISTENT_PROPS[k].length
    }));

    return meta.map((info) => {
      if (info.encodedStateLength < 1) {
        return;
      }

      result = {};
      j = 0;
      chunk = str.slice(i, i + info.encodedStateLength);
      decodedChunk = parseInt(chunk, 16).toString();
      numProps = decodedChunk[0];
      whichEnd = parseInt(numProps, 10) + 1;

      whichProps = decodedChunk.slice(1, whichEnd)
        .split('')
        .map((prop) => parseInt(prop, 10));

      propsData = decodedChunk.slice(whichEnd, decodedChunk.length);

      result = {
        id: info.id,
        attributes: {}
      };

      whichProps.forEach((id) => {
        prop = props.findBy('id', id);
        propData = propsData.slice(j, j + prop.length);
        result.attributes[prop.name] = parseInt(propData, 10);
        j += prop.length;
      });

      i += info.encodedStateLength;
      return result;
    }).compact();
  },

  applyUrlData(stems, ids, stemData, store) {
    if (!ids) {
      return;
    }

    ids.forEach((id) => {
      const stem = store.peekRecord('stem', id);

      if (!stem) {
        return;
      }

      stem.set('on', true);

      if (stemData && stemData.findBy('id', id)) {
        const data = stemData.findBy('id', id).attributes;

        Object.keys(data).forEach((k) => {
          stem.set(k, stem.urlDecode(k, data[k]));
        });
      }
    });
  }
});
