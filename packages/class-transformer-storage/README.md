# class-transformer-storage

Extends the powerful package [class-transformer](https://github.com/typestack/class-transformer) with a global storage mechanism for constructors and a dedicated function to dynamically instantiate class instances from constructors stored in the global storage.

## Usage

The ideal use case is via Typescript decorators. Any class can be decorated with the `@RegisterType()` decorator to add to the global storage to then be recalled using the `ctPlainToInstance` function. By default the function will reference the `name` property of a plain object to determine which constructor to use. This can be overridden in the parameters with the `getName` option which takes the plain version of the object as a parameter.

```ts
// Define the type and decorate
@RegisterType()
class DemoType {
  public hello: string;

  constructor() {
    this.name = this.constructor.name;
  }
}

const instance = new DemoType();

// Convert to plain object using class transformer
const plain = instanceToPlain(instance);

const recreatedInstance = ctPlainToInstance(plain);

console.log(recreatedInstance instanceof DemoType); // true
```

The global store can be referenced manually as well by calling the `CTStore` static methods directly.
