import { MessageRequestState } from "../cqrs.constants";

export class InvalidMessageRequestStateException extends Error {
  constructor(
    currentState: MessageRequestState,
    desiredState: MessageRequestState,
  ) {
    super(`Invalid transition from ${currentState} to ${desiredState}`);
    this.name = this.constructor.name;
  }
}
