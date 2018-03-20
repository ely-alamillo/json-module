import * as fs from 'fs';
import { resolve } from 'dns';

class jsonModule {
  private static instance: jsonModule;
  private _path: string;
  private _name: string;

  public constructor() {
    if (jsonModule.instance) {
      throw new Error(
        'YOu cannot create an object of this type. Try using jsonModule.getInstance()'
      );
    }
  }

  public saveJSON(json) {
    // save to DISK
    let path = `${this._path}/${this._name}`;
    const data = JSON.stringify(json);

    let pathExist = false;

    try {
      fs.accessSync(path);
      pathExist = true;
    } catch (error) {
      throw error;
    }
    if (!path) {
      // crete the path
      fs.mkdirSync(this._path);
    }
    // writes out to DISK
    fs.writeFileSync(path, data, 'utf8');
  }

  public getJSON(json): Promise<{}> {
    // return JSON
    const promise = new Promise((resolve, reject) => {
      if (jsonModule.isset(this._name && jsonModule.isset(this._path))) {
        let name = `${this._path}/${this._name}`;
        if (fs.lstatSync(name).isFile) {
          // file exists
          fs.readFile(name, 'utf8', (err, data) => {
            if (err) reject(err);
            resolve(JSON.parse(data));
          });
        } else {
          reject(new Error('Invalid file! Path can not be resolved'));
        }
      } else {
        reject(new Error('Path and name are required.'));
      }
    });
    return promise;
  }

  public get path() {
    // get path
    return this._path;
  }

  public set path(path) {
    // set path
    this._path = path;
  }

  public get name() {
    // get name
    return this._name;
  }

  public set name(name) {
    // set name
    this._name = name;
  }

  public static getInstance(name?: string, path?: string): jsonModule {
    // get local instance
    if (jsonModule.instance === undefined) {
      jsonModule.instance = new jsonModule();
    }
    if (jsonModule.isset(name)) {
      jsonModule.instance._name = name;
    }
    if (jsonModule.isset(path)) {
      jsonModule.instance._path = path;
    }
    return jsonModule.instance;
  }

  private static isset(value): boolean {
    let set = false;
    if (value !== undefined || value !== null) {
      set = true;
    }
    return set;
  }
}

export { jsonModule };
