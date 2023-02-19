import { IEventVersioner } from "./event-versioner.interface";
import { ClassConstructor } from "class-transformer";

export interface IEventConfiguration {
  /**
   * Provide a specific class for versioning the
   * decorated event type.
   */
  versioner?: ClassConstructor<IEventVersioner>;
}
