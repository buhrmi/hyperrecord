import "../node_modules/fake-indexeddb/auto.js"

import db from '../src/db.mjs'



import Hyperrecord from '../src/model.mjs'

async function clearStore() {
  const store = await db.getStore()
  await store.clear()
}

describe("The model base class", function() {

  afterEach(clearStore)

  it("can make subclasses", async function() {
    const User = Hyperrecord.model("User")
    expect(User.name).toEqual("User")

    const user = await User.create({ name: "John Doe" })
  
    expect(user).toBeInstanceOf(User)
    expect(user.attrs.name).toEqual("John Doe")
    expect(user.subscribe).toBeInstanceOf(Function);
    expect(user.set).toBeInstanceOf(Function);
    await clearStore() // afterEach(clearStore) doesn't work
  });

});

describe("A record", function() {
  it("can be subscribed to", async function() {
    const User = Hyperrecord.model("User")
    const user = await User.create({ name: "John Doe" })
    const spy = jasmine.createSpy('subscription')
    user.subscribe(spy)
    expect(spy).toHaveBeenCalledWith({ name: "John Doe" })
    await clearStore() // afterEach(clearStore) doesn't work
  })

  it("can find last record", async function() {
    const User = Hyperrecord.model("User")
    await User.create({ name: "first" })
    await User.create({ name: "second" })
    await User.create({ name: "last" })  
    const lastUser = await User.last()
    expect(lastUser.attrs.name).toEqual("last")
    await clearStore() // afterEach(clearStore) doesn't work
  })

  it("can find itself", async function() {
    const User = Hyperrecord.model("User")
    const user1 = await User.create({ name: "first" })
    const user2 = await User.create({ name: "second" })
    const user3 = await User.create({ name: "last" })  
    const foundUser = await User.where({ name: "second" }).first()
    expect(foundUser.attrs.name).toEqual("second")
    await clearStore() // afterEach(clearStore) doesn't work
  })

  it("can find first record", async function() {
    const User = Hyperrecord.model("User")
    await User.create({ name: "first" })
    await User.create({ name: "second" })
    await User.create({ name: "last" })
    const firstUser = await User.first()
    expect(firstUser.attrs.name).toEqual("first")
    await clearStore() // afterEach(clearStore) doesn't work
  })

  it("triggers subscriptions when set is called", async function() {
    const User = Hyperrecord.model("User")
    const user = await User.create({ name: "John Doe" })
    const spy = jasmine.createSpy('subscription')
    user.subscribe(spy)
    expect(spy).toHaveBeenCalledWith({ name: "John Doe" })

    user.set({ name: "Jane Doe" })
    expect(spy).toHaveBeenCalledWith({ name: "Jane Doe" })
    await clearStore() // afterEach(clearStore) doesn't work
  })

  it("can be unsubscribed from", async function() {
    const User = Hyperrecord.model("User")
    const user = await User.create({ name: "John Doe" })
    const spy = jasmine.createSpy('subscription')
    const unsubscribe = user.subscribe(spy)
    expect(spy).toHaveBeenCalledWith({ name: "John Doe" })
    unsubscribe()
    user.set({ name: "Jane Doe" })
    expect(spy).toHaveBeenCalledWith({ name: "John Doe" })
    await clearStore() // afterEach(clearStore) doesn't work
  })
})