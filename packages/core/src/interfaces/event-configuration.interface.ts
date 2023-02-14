import { IEventVersioner } from "./event-versioner.interface";
import { ClassConstructor } from "class-transformer";

export interface IEventConfiguration {
  versioner?: ClassConstructor<IEventVersioner>;
}
