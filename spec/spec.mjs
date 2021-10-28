import "../node_modules/fake-indexeddb/auto.js"

import Model from '../src/model.mjs'

describe("The model base class", function() {

  it("can make subclasses", async function() {
    const User = Model.make("User")
    expect(User.name).toEqual("User")

    const user = await User.create({ name: "John Doe" })
  
    expect(user).toBeInstanceOf(User)
    expect(user.attrs.name).toEqual("John Doe")
    expect(user.subscribe).toBeInstanceOf(Function);
    expect(user.set).toBeInstanceOf(Function);
  });

});

describe("A record", function() {
  it("can be subscribed to", async function() {
    const User = Model.make("User")
    const user = await User.create({ name: "John Doe" })
    const spy = jasmine.createSpy('subscription')
    user.subscribe(spy)
    expect(spy).toHaveBeenCalledWith({ name: "John Doe" })
  })

  it("can find last record", async function() {
    const User = Model.make("User")
    const user = await User.create({ name: "Jamaican Doe" })
    await user.save()
    const lastUser = await User.last()
    expect(lastUser.attrs.name).toEqual("Jamaican Doe")
  })

  it("triggers subscriptions when set is called", async function() {
    const User = Model.make("User")
    const user = await User.create({ name: "John Doe" })
    const spy = jasmine.createSpy('subscription')
    user.subscribe(spy)
    expect(spy).toHaveBeenCalledWith({ name: "John Doe" })

    user.set({ name: "Jane Doe" })
    expect(spy).toHaveBeenCalledWith({ name: "Jane Doe" })
  })

  it("can be unsubscribed from", async function() {
    const User = Model.make("User")
    const user = await User.create({ name: "John Doe" })
    const spy = jasmine.createSpy('subscription')
    const unsubscribe = user.subscribe(spy)
    expect(spy).toHaveBeenCalledWith({ name: "John Doe" })
    unsubscribe()
    user.set({ name: "Jane Doe" })
    expect(spy).toHaveBeenCalledWith({ name: "John Doe" })
  })
})