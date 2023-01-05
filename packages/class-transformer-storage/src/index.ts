import { ClassTransformOptions, plainToInstance } from "class-transformer";
import { CTStore } from "./ct.store";
import { UnparsableNameException } from "./unparsable-name.exception";

export { CTStore } from "./ct.store";
export { RegisterType } from "./register.decorator";
export { UnparsableNameException } from "./unparsable-name.exception";

/**
 * Wrap the class-transformer `plainToInstance` function by referencing
 * the global store for the constructor.
 *
 * @param plain Object to convert
 * @param options Class transformer options as well as the `getName` function
 * used to define which constructor should be used to re-create the object.
 *
 * @throws UnparsableNameException in the event that the name is not parsable
 */
export function ctPlainToInstance(
  plain: unknown,
  options: ClassTransformOptions & {
    getName?: (plain: unknown) => string;
  } = {},
) {
  const { getName, ...rest } = options;
  const name = getName?.(plain) || plain["name"];
  if (!name) throw new UnparsableNameException(plain);
  const constructor = CTStore.get(name);
  return plainToInstance(constructor, plain, rest);
}
