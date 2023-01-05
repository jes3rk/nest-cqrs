import { ClassConstructor } from "class-transformer";
import { CTStore } from "./ct.store";

/**
 * Register a class within the global scope for use with the class
 * transformer storage.
 */
export const RegisterType = () => (target: ClassConstructor<any>) => {
  CTStore.add(target);
};
