import { MessageRequestState } from "../cqrs.constants";
import { InvalidMessageRequestStateException } from "../exceptions/invalid-message-request-state.exception";
import { IMessage } from "../interfaces/message.interface";
import { IPrePublishMiddleware } from "../interfaces/prepublish-middleware.interface";

export class MessageRequest {
  public error: Error;
  public readonly messageType: string;
  private _message: IMessage;
  private state: MessageRequestState;

  constructor(message: IMessage, messageType: string) {
    this._message = message;
    this.messageType = messageType;
  }

  public get STATE(): MessageRequestState {
    return this.state;
  }

  public get message(): IMessage {
    return this._message;
  }

  /**
   * Apply a middleware to the message request
   */
  public async applyMiddleware(
    middleware: IPrePublishMiddleware | IPrePublishMiddleware,
  ): Promise<void> {
    this._message = await middleware.apply(this._message);
  }

  /**
   * Set state to APPLY_FILTERS and store error value for handling
   * later.
   * @param err
   */
  public setStateErrored(err: Error): void {
    this.state = MessageRequestState.APPLY_FILTERS;
    this.error = err;
  }

  /**
   * Set state to APPLY_PREPUBLISH_MIDDLEWARE.
   *
   * @throws InvalidMessageRequestStateException
   */
  public setStatePrePublish(): void {
    if (this.state !== MessageRequestState.INITIATED)
      throw new InvalidMessageRequestStateException(
        this.state,
        MessageRequestState.APPLY_PREPUBLISH_MIDDLEWARE,
      );
    this.state = MessageRequestState.APPLY_PREPUBLISH_MIDDLEWARE;
  }

  /**
   * Set state to PUBLISH.
   *
   * @throws InvalidMessageRequestStateException
   */
  public setStatePublish(): void {
    if (this.state !== MessageRequestState.APPLY_PREPUBLISH_MIDDLEWARE)
      throw new InvalidMessageRequestStateException(
        this.state,
        MessageRequestState.PUBLISH,
      );
    this.state = MessageRequestState.PUBLISH;
  }

  public static generateRequest(
    message: IMessage,
    messageType: string,
  ): MessageRequest {
    const request = new MessageRequest(message, messageType);
    request.state = MessageRequestState.INITIATED;
    return request;
  }
}
