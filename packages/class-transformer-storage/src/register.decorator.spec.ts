import { CTStore } from "./ct.store";
import { RegisterType } from "./register.decorator";

describe("RegisterType", () => {
  it("will store the type", () => {
    @RegisterType()
    class Storable {}

    expect(CTStore.get(Storable.name)).toEqual(Storable);
  });
});
