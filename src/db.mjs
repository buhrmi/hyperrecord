const db = new Promise(function(resolve, reject) {
  const request = indexedDB.open('hyperrecord', 1)
  request.onupgradeneeded = function(event) {
    const db = event.target.result
    const store = db.createObjectStore('records', { autoIncrement: true })
    store.createIndex('model', 'model', { unique: false })
  }
  request.onsuccess = function(event) {
    resolve(event.target.result);
  }
  request.onerror = reject
})

export default {
  async getStore(mode = 'readwrite') {
    return (await db).transaction(['records'], mode).objectStore('records')
  },
  getReadonlyStore() {
    return this.getStore('readonly')
  }
}