import * as chai from 'chai';
import * as root from 'app-root-path';
import { jsonModule } from '../src/jsonModule';

const assert = chai.assert;

describe('Singleton', () => {
  let easy: jsonModule;
  before(done => {
    const destination = `${root.path}/config`;
    easy = jsonModule.getInstance('config.json', destination);
    done();
  });

  it('Is a single instance being returned ?', () => {
    assert.isObject(easy);
  });

  it('Fails on double instantiations', () => {
    assert.throw(
      () => {
        try {
          let myJSON = new jsonModule();
        } catch (e) {
          throw e;
        }
      },
      Error,
      "Yikes! You can't create this object. Try jsonModule.getInstance()"
    );
  });
});

describe('Settings the getter and setter for the path value', () => {
  let easy: jsonModule;
  const destination = `${root.path}/config`;
  before(done => {
    easy = jsonModule.getInstance('config.json', destination);
    done();
  });

  it('Path value match on the instance', () => {
    assert.equal(easy.path, destination, '=== path values match up');
  });
  it('Path values match on set', () => {
    const path = `${root.path}/custom-scripts`;
    easy.path = path;
    assert.equal(easy.path, path, '=== custom path values match up');
  });
  it('Name value match on instance', () => {
    assert.equal(easy.name, 'config.json', '=== names values match up');
  });
  it('Name value match on set', () => {
    const name = `$custom-scripts.json`;
    easy.name = name;
    assert.equal(easy.name, name, '=== custom name values match up');
  });
});

describe('Saving to Disk', () => {
  let easy: jsonModule;
  before(done => {
    const destination = `${root.path}/config`;
    easy = jsonModule.getInstance('config.json', destination);
    done();
  });
  it('Save to Disk', () => {
    const data = [
      {
        name: 'ely',
        age: 22
      },
      { name: 'Jon', age: 25 }
    ];
    assert.isUndefined(easy.saveJSON(data));
  });
  it('Fails on invalid destination', () => {
    const data = [
      {
        name: 'ely',
        age: 22
      },
      { name: 'Jon', age: 25 }
    ];
    easy.name = `${root.path}/config/blank`;
    easy.path = 'configurations.json';
    assert.throws(() => {
      try {
        easy.saveJSON(data);
      } catch (e) {
        throw e;
      }
    }, Error);
  });
});

describe('Reading from Disk', () => {
  let easy: jsonModule;
  const data = [
    {
      name: 'ely',
      age: 22
    },
    { name: 'Jon', age: 25 }
  ];
  before(done => {
    const destination = `${root.path}/config`;
    easy = jsonModule.getInstance('config.json', destination);
    easy.saveJSON(data);
    done();
  });
  it('Promise received', () => {
    const promise = easy.getJSON();
    assert.isDefined(promise);
    assert.typeOf(promise, 'Promise');
  });
  it('Reads from Disk', () => {
    const promise = easy.getJSON();
    return promise.then(raw => {
      assert.deepEqual(raw, data, 'Data is not the same!');
    });
  });
  it('Fails on invalid Destination', () => {
    easy.path = undefined;
    easy.name = undefined;
    const promise = easy.getJSON();
    return promise.catch(error => {
      assert.throws(() => {
        throw error;
      }, Error);
    });
  });
});
