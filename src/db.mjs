const db = new Promise(function(resolve, reject) {
  const request = indexedDB.open('hyperrecord', 1)
  request.onupgradeneeded = function(event) {
    const db = event.target.result
    db.createObjectStore('records', { autoIncrement: true })
  }
  request.onsuccess = function(event) {
    resolve(event.target.result);
  }
  request.onerror = reject
})

export default {
  async getStore() {
    return (await db).transaction(['records'], 'readwrite').objectStore('records')
  }
}