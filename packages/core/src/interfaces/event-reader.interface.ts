import { IEvent } from "./event.interface";

export interface IEventReader {
  /**
   * Read from a stream asynchronously calling the callback for each event
   * and concluding when the stream has been read.
   *
   * @param streamId
   * @param callback
   */
  readStreamAsynchronously(
    streamId: string,
    callback: (event: IEvent) => void,
  ): Promise<void>;
}
