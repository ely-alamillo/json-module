"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
class jsonModule {
    constructor() {
        if (jsonModule.instance) {
            throw new Error("Yikes! You can't create this object. Try jsonModule.getInstance()");
        }
    }
    saveJSON(json) {
        // save to DISK
        let path = `${this._path}/${this._name}`;
        const data = JSON.stringify(json);
        let pathExist = false;
        try {
            fs.accessSync(this._path);
            pathExist = true;
        }
        catch (error) {
            throw error;
        }
        if (!path) {
            // crete the path
            fs.mkdirSync(this._path);
        }
        // writes out to DISK
        fs.writeFileSync(path, data, 'utf8');
    }
    getJSON() {
        // return JSON
        const promise = new Promise((resolve, reject) => {
            if (jsonModule.isset(this._name && jsonModule.isset(this._path))) {
                let name = `${this._path}/${this._name}`;
                if (fs.lstatSync(name).isFile) {
                    // file exists
                    fs.readFile(name, 'utf8', (err, data) => {
                        if (err)
                            reject(err);
                        resolve(JSON.parse(data));
                    });
                }
                else {
                    reject(new Error('Invalid file! Path can not be resolved'));
                }
            }
            else {
                reject(new Error('Path and name are required.'));
            }
        });
        return promise;
    }
    get path() {
        // get path
        return this._path;
    }
    set path(path) {
        // set path
        this._path = path;
    }
    get name() {
        // get name
        return this._name;
    }
    set name(name) {
        // set name
        this._name = name;
    }
    static getInstance(name, path) {
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
    static isset(value) {
        let set = false;
        if (value !== undefined || value !== null) {
            set = true;
        }
        return set;
    }
}
exports.jsonModule = jsonModule;
