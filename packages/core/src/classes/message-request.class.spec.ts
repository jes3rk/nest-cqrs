import { IMessage } from "../interfaces/message.interface";
import { MessageRequest } from "./message-request.class";
import { faker } from "@faker-js/faker";
import { MessageRequestState, MessageType } from "../cqrs.constants";
import { IPrePublishMiddleware } from "../interfaces/prepublish-middleware.interface";
import { InvalidMessageRequestStateException } from "../exceptions/invalid-message-request-state.exception";

describe("MessageRequest", () => {
  describe("fromEmit", () => {
    let message: IMessage;

    beforeEach(() => {
      message = {
        $metadata: {},
        $name: "TestMessage",
        $payload: {},
        $uuid: faker.datatype.uuid(),
      };
    });
    it("will generate a new MessageRequest with state INITIATED", () => {
      const request = MessageRequest.generateRequest(
        message,
        MessageType.EVENT,
      );
      expect(request.STATE).toEqual(MessageRequestState.INITIATED);
      expect(request.message).toEqual(message);
    });
  });

  describe("preProcessMiddleware", () => {
    let message: MessageRequest;
    let middleware: IPrePublishMiddleware;

    beforeEach(() => {
      message = MessageRequest.generateRequest(
        {
          $metadata: {},
          $name: "TestMessage",
          $payload: {},
          $uuid: faker.datatype.uuid(),
        },
        MessageType.EVENT,
      );
      middleware = {
        apply: jest.fn((msg) => msg),
      };
    });

    it("will correctly change state", () => {
      message.setStatePrePublish();
      expect(message.STATE).toEqual(
        MessageRequestState.APPLY_PREPUBLISH_MIDDLEWARE,
      );
    });

    it("will throw an error if the state is incorrect", () => {
      message["state"] = MessageRequestState.APPLY_FILTERS;
      expect(() => message.setStatePrePublish()).toThrowError(
        InvalidMessageRequestStateException,
      );
    });

    it("will apply the middleware", async () => {
      await message.applyMiddleware(middleware);
      expect(middleware.apply).toHaveBeenCalledTimes(1);
      expect(middleware.apply).toHaveBeenCalledWith(message.message);
    });
  });

  describe("publish", () => {
    let message: MessageRequest;

    beforeEach(() => {
      message = MessageRequest.generateRequest(
        {
          $metadata: {},
          $name: "TestMessage",
          $payload: {},
          $uuid: faker.datatype.uuid(),
        },
        MessageType.EVENT,
      );
      message["state"] = MessageRequestState.APPLY_PREPUBLISH_MIDDLEWARE;
    });

    it("will correctly change the state", () => {
      message.setStatePublish();
      expect(message.STATE).toEqual(MessageRequestState.PUBLISH);
    });

    it("will throw an error if the state is incorrect", () => {
      message["state"] = MessageRequestState.APPLY_FILTERS;
      expect(() => message.setStatePrePublish()).toThrowError(
        InvalidMessageRequestStateException,
      );
    });
  });
});
