import { IEvent } from "../interfaces/event.interface";

/**
 * Provide a base class with some validation methods for asserting an event
 * operation is allowed.
 */
export abstract class EventVersioner {
  /**
   * Upcast an event to the latest version
   */
  public abstract upcastToVersion(event: IEvent): IEvent;
  /**
   * Upcast an event to a specific version number
   */
  public abstract upcastToVersion(event: IEvent, targetVersion: number): IEvent;
  public abstract upcastToVersion(
    event: IEvent,
    targetVersion?: number,
  ): IEvent;

  /**
   * Validate whether or not the event upcast operation is supported
   */
  protected validateUpcast(event: IEvent, targetVersion: number): boolean {
    return event.$version <= targetVersion;
  }
}
