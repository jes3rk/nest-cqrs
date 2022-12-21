import { ClassTransformOptions, plainToInstance } from "class-transformer";
import { CTStore } from "./ct.store";
import { UnparsableNameException } from "./unparsable-name.exception";

export { CTStore } from "./ct.store";
export { RegisterType } from "./register.decorator";
export { UnparsableNameException } from "./unparsable-name.exception";

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
