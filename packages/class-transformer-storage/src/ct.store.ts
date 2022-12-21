import { ClassConstructor } from "class-transformer";

/**
 * Storage class
 */
export class CTStore {
  private static _instance: CTStore;

  private _store: Map<string, ClassConstructor<any>>;

  constructor() {
    this._store = new Map();
  }

  public static getInstance(): CTStore {
    if (!CTStore._instance) CTStore._instance = new CTStore();
    return CTStore._instance;
  }

  /**
   * Add a type to the storage for use later
   * @param constructor Type to store
   */
  public static add(constructor: ClassConstructor<any>): void {
    return CTStore.getInstance().add(constructor);
  }

  private add(constructor: ClassConstructor<any>): void {
    this._store.set(constructor.name, constructor);
  }

  /**
   * Retrieve a type from storage
   * @param name Name of the type to retrieve
   */
  public static get(
    name: ClassConstructor<any>["name"],
  ): ClassConstructor<any> {
    return CTStore.getInstance().get(name);
  }

  private get(name: ClassConstructor<any>["name"]): ClassConstructor<any> {
    return this._store.get(name) ?? Object;
  }

  /**
   * Reset the store to default
   */
  public static reset(): void {
    return CTStore.getInstance().reset();
  }

  private reset(): void {
    this._store.clear();
  }
}
