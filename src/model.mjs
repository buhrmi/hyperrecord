import db from './db.mjs'

// Querying data should follow this general schema:
// 1. Build a subscription identifier from model name and query parameters
// 2. See if we already have a subscription for this identifier
// 3. If we do, return the existing entries from indexeddb
// 4. If we don't, create a new subscription and return the first batch
class Query {
  constructor (model, params) {
    this.model = model
    this.params = params
    this.order = 'asc'
  }
  
  async last() {
    if (this.order == 'desc') this.order = 'asc'
    else this.order = 'desc'
    return this.first()
  }

  async first() {
    const request = await this.buildRequest()
    return new Promise((resolve) => {
      request.onsuccess = (event) => {
        const cursor = event.target.result
        if (cursor) {
          resolve(new this.model(cursor.value.attrs))
        } else {
          resolve(null)
        }
      }
    })
  }

  async buildRequest() {
    const store = await db.getReadonlyStore()
    const index = store.index('model')
    let request
    if (this.order === 'asc') {
      request = index.openCursor(null, 'next')
    } else {
      request = index.openCursor(null, 'prev')
    }
    return request
  }
}

export default class {
  // Returns a new model class with the purpose of being augmented by Opal/Ruby2JS/etc
  static model(modelName) {
    return class extends this {
      static name = modelName
      constructor(attrs) {
        super()
        this._subscribers = []
        this.attrs = attrs
      }
    }
  }

  static async find() {
    // TODO
    return new this({});
  }
  
  static async last() {
    return await new Query(this).last();
  }

  static async first() {
    return await new Query(this).first();
  }

  static where(params) {
    return new Query(this, params);
  }
  
  static async create(attrs) {
    const record = new this(attrs);
    await record.save();
    return record;
  }


  async save() {
    const objectStore = await db.getStore()
    objectStore.add({model: this.constructor.name, attrs: this.attrs})
    // TODO: save remotely
  }

  async reload() {
    // TODO
  }

  subscribe(callback) {
    callback(this.attrs)
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
