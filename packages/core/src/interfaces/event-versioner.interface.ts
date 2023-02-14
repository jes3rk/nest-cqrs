import { IEvent } from "./event.interface";

export interface IEventVersioner {
  upcastToVersion(event: IEvent, targetVersion?: number): IEvent;
}
