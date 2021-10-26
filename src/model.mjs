export default class {
  
  // Returns a new model class with the purpose of being augmented by Opal/Ruby2JS/etc
  static make(modelName) {
    return class extends this {
      static name = modelName;
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

  static create(attrs) {
    const record = new this(attrs);
    record.save();
    return record;
  }

  async save() {
    // TODO
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
