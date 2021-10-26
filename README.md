# HyperRecord

[![<HyperRecord>](https://circleci.com/gh/buhrmi/hyperrecord.svg?style=shield)](https://app.circleci.com/pipelines/github/buhrmi/hyperrecord)

Framework-agnostic client-side adapter for [HyperModel](https://docs.hyperstack.org/hyper-model)

## Usage

```js
import { Model } from 'hyperrecord'

// Create a model
const User = Model.make('User')

// Create a record with a `name` attribute
const user = await User.create({name: 'John Doe'})

// Subscribe to changes
const unsubscribe = user.subscribe(function(attrs) {
  console.log(attrs.name)
})

// Make changes
user.set({name: 'Jane Doe'})

// Save them
await user.save()

// Unsubscribe
unsubscribe()
```

## Testing

    npm run test
