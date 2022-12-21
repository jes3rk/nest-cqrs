import { CTStore } from "./ct.store";
import { RegisterType } from "./register.decorator";

describe("CTStore", () => {
  class Storable {}
  class Unstorable {}

  afterEach(() => {
    CTStore.reset();
  });

  it("will return a class constructor for a given name", () => {
    CTStore.add(Storable);
    expect(CTStore.get(Storable.name)).toEqual(Storable);
  });

  it("will return OBJECT for a class constructor not defined", () => {
    expect(CTStore.get(Unstorable.name)).toEqual(Object);
  });

  it("will clear the storage", () => {
    CTStore.add(Storable);
    expect(CTStore.get(Storable.name)).toEqual(Storable);
    CTStore.reset();
    expect(CTStore.get(Storable.name)).toEqual(Object);
  });
});
