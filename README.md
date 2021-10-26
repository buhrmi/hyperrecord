# HyperRecord

Frontend-agnostic client-side adapter for [HyperModel](https://docs.hyperstack.org/hyper-model)

## Usage

```js
import { Model } from 'hyperrecord'

// Create a model
const User = Model.make('User')

// Create a record with a `name` attribute
const user = await User.create({name: 'John Doe'})

// Subscribe to changes
user.subscribe(function(attrs) {
  console.log(attrs.name)
})
```

## Testing

    npm run test
