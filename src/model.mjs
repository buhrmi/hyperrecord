export default class {
  
  // Returns a new model class with the purpose of being augmented by Opal/Ruby2JS/etc
  static make(modelName) {
    const Model = class extends this {
      static name = modelName;
      constructor(attrs) {
        super();
        this.attrs = attrs;
      }
    }
    return Model;
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
    return function() {
      // TODO: Unsubscribe
    }
  }

  set() {
    // TODO
  }

}
