import { instanceToPlain } from "class-transformer";
import { ctPlainToInstance } from ".";
import { CTStore } from "./ct.store";
import { RegisterType } from "./register.decorator";
import { UnparsableNameException } from "./unparsable-name.exception";

describe("Functions", () => {
  describe("ctPlainToInstance", () => {
    afterEach(() => {
      CTStore.reset();
    });

    it("will create a new object with a name function", () => {
      @RegisterType()
      class Storable {}
      const getName = jest.fn(() => Storable.name);
      const plain = instanceToPlain(new Storable());

      expect(ctPlainToInstance(plain, { getName })).toBeInstanceOf(Storable);
      expect(getName).toHaveBeenCalledTimes(1);
      expect(getName).toHaveBeenCalledWith(plain);
    });

    it("will use a name property if no name function is provided", () => {
      @RegisterType()
      class StorableName {
        public readonly name = StorableName.name;
      }

      const plain = instanceToPlain(new StorableName());
      expect(ctPlainToInstance(plain)).toBeInstanceOf(StorableName);
    });

    it("will throw an error if neither a name function or property exist", () => {
      @RegisterType()
      class Storable {}
      const plain = instanceToPlain(new Storable());

      expect(() => ctPlainToInstance(plain)).toThrowError(
        UnparsableNameException,
      );
    });
  });
});
