import { IMessage } from "../interfaces/message.interface";
import { MessageRequest } from "./message-request.class";
import { faker } from "@faker-js/faker";
import { MessageRequestState } from "../cqrs.constants";
import { IPrePublishMiddleware } from "../interfaces/prepublish-middleware.interface";
import { IPreProcessMiddleware } from "../interfaces/preprocess-middleware.interface";
import { InvalidMessageRequestStateException } from "../exceptions/invalid-message-request-state.exception";

describe("MessageRequest", () => {
  describe("fromEmit", () => {
    let message: IMessage;

    beforeEach(() => {
      message = {
        $idempotentID: faker.datatype.uuid(),
        $name: "TestMessage",
        $uuid: faker.datatype.uuid(),
      };
    });
    it("will generate a new MessageRequest with state INITIATED", () => {
      const request = MessageRequest.generateRequest(message);
      expect(request.STATE).toEqual(MessageRequestState.INITIATED);
      expect(request.message).toEqual(message);
    });
  });

  describe("preProcessMiddleware", () => {
    let message: MessageRequest;
    let middleware: IPrePublishMiddleware;

    beforeEach(() => {
      message = MessageRequest.generateRequest({
        $idempotentID: faker.datatype.uuid(),
        $name: "TestMessage",
        $uuid: faker.datatype.uuid(),
      });
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
});
