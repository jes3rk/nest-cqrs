import { MessageRequestState } from "../cqrs.constants";
import { InvalidMessageRequestStateException } from "../exceptions/invalid-message-request-state.exception";
import { IMessage } from "../interfaces/message.interface";
import { IPrePublishMiddleware } from "../interfaces/prepublish-middleware.interface";

export class MessageRequest {
  public error: Error;
  private _message: IMessage;
  private state: MessageRequestState;

  constructor(message: IMessage) {
    this._message = message;
  }

  public get STATE(): MessageRequestState {
    return this.state;
  }

  public get message(): IMessage {
    return this._message;
  }

  public async applyMiddleware(
    middleware: IPrePublishMiddleware | IPrePublishMiddleware,
  ): Promise<void> {
    this._message = await middleware.apply(this._message);
  }

  public setStateErrored(err: Error): void {
    this.state = MessageRequestState.APPLY_FILTERS;
    this.error = err;
  }

  public setStatePrePublish(): void {
    if (this.state !== MessageRequestState.INITIATED)
      throw new InvalidMessageRequestStateException(
        this.state,
        MessageRequestState.APPLY_PREPUBLISH_MIDDLEWARE,
      );
    this.state = MessageRequestState.APPLY_PREPUBLISH_MIDDLEWARE;
  }

  public static generateRequest(message: IMessage): MessageRequest {
    const request = new MessageRequest(message);
    request.state = MessageRequestState.INITIATED;
    return request;
  }
}
