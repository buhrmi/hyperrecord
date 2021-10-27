'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const db = new Promise(function(resolve, reject) {
  const request = indexedDB.open('hyperrecord', 1);
  request.onupgradeneeded = function(event) {
    const db = event.target.result;
    db.createObjectStore('records', { autoIncrement: true });
  };
  request.onsuccess = function(event) {
    resolve(event.target.result);
  };
  request.onerror = reject;
});

var db$1 = {
  async getStore() {
    return (await db).transaction(['records'], 'readwrite').objectStore('records')
  }
};

// Querying data should follow this general schema:
// 1. Build a subscription identifier from model name and query parameters
// 2. See if we already have a subscription for this identifier
// 3. If we do, return the existing entries from indexeddb
// 4. If we don't, create a new subscription and return the first batch

class model {
  // Returns a new model class with the purpose of being augmented by Opal/Ruby2JS/etc
  static make(modelName) {
    return class extends this {
      static name = modelName
      constructor(attrs) {
        super();
        this._subscribers = [];
        this.attrs = attrs;
      }
    }
  }

  static async find() {
    // TODO
  }

  static where() {
    // TODO
  }
  
  static async create(attrs) {
    const record = new this(attrs);
    await record.save();
    return record;
  }


  async save() {
    const objectStore = await db$1.getStore();
    objectStore.add({model: this.constructor.name, attrs: this.attrs});
  }

  async reload() {
    // TODO
  }

  subscribe(callback) {
    callback(this.attrs);
    this._subscribers.push(callback);
    return () => {
      // Unsubscribe
      this._subscribers = this._subscribers.filter(subscriber => subscriber !== callback);
    }
  }

  set(newAttrs) {
    // TODO: might be unexpected to merge the new attrs into the existing attrs instead of replacing them
    this.attrs = {...this.attrs, ...newAttrs};
    this._subscribers.forEach(subscriber => subscriber(this.attrs));
  }

}

exports.Model = model;
