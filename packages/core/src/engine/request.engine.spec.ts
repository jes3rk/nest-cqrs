import { RequestEngine } from "./request.engine";
import { Test } from "@nestjs/testing";
import { MessageRequestState, MESSAGE_PUBLISHER } from "../cqrs.constants";
import { MessageRequest } from "../classes/message-request.class";
import { faker } from "@faker-js/faker";
import { IPrePublishMiddleware } from "../interfaces/prepublish-middleware.interface";
import { IMessage } from "../interfaces/message.interface";
import { PrePublishMiddleware } from "../decorators/pre-publish-middleware.decorator";
import { DiscoveryService } from "@nestjs/core";
import { ExceptionFilter } from "@nestjs/common";
import { CQRSFilter } from "../decorators/cqrs-filter.decorator";
import { IPublisher } from "../interfaces/publisher.interface";

describe("RequestEngine", () => {
  let engine: RequestEngine;
  let preMiddleware: TestPreMiddleware;
  let filter: ExceptionFilter;
  let publisher: IPublisher;

  @PrePublishMiddleware()
  class TestPreMiddleware implements IPrePublishMiddleware {
    apply(message: IMessage): IMessage | Promise<IMessage> {
      return message;
    }
  }

  @CQRSFilter(Error)
  class TestFilter implements ExceptionFilter {
    catch() {
      // pass
    }
  }

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        RequestEngine,
        TestPreMiddleware,
        DiscoveryService,
        TestFilter,
        {
          provide: MESSAGE_PUBLISHER,
          useValue: {
            publish: jest.fn(),
          },
        },
      ],
    }).compile();

    engine = module.get(RequestEngine);
    preMiddleware = module.get(TestPreMiddleware);
    filter = module.get(TestFilter);
    publisher = module.get(MESSAGE_PUBLISHER);
    engine.onApplicationBootstrap();
  });

  it("will be defined", () => {
    expect(engine).toBeDefined();
  });

  describe("handleMessageRequest", () => {
    let message: MessageRequest;

    beforeEach(() => {
      message = new MessageRequest({
        $idempotentID: faker.datatype.uuid(),
        $name: "TestMessage",
        $uuid: faker.datatype.uuid(),
      });
      message["state"] = MessageRequestState.INITIATED;
    });

    it(`will transition the state of the message request to ${MessageRequestState.PUBLISH}`, async () => {
      await engine.handleMessageRequest(message);
      expect(message.STATE).toEqual(MessageRequestState.PUBLISH);
    });

    it("will apply the middleware functions", async () => {
      const preSpy = jest.spyOn(preMiddleware, "apply");
      await engine.handleMessageRequest(message);

      expect(preSpy).toHaveBeenCalledTimes(1);
      expect(preSpy).toHaveBeenCalledWith(message.message);
    });

    it("will trigger the error handlers on error", async () => {
      const preSpy = jest
        .spyOn(preMiddleware, "apply")
        .mockRejectedValue(new Error());
      const filterSpy = jest.spyOn(filter, "catch");
      await engine.handleMessageRequest(message);

      expect(preSpy).toHaveBeenCalled();
      expect(filterSpy).toHaveBeenCalledTimes(1);
      expect(filterSpy).toHaveBeenCalledWith(new Error(), undefined);
    });

    it("will call publisher.publish", async () => {
      const publishSpy = jest.spyOn(publisher, "publish");
      await engine.handleMessageRequest(message);
      expect(publishSpy).toHaveBeenCalledTimes(1);
      expect(publishSpy).toHaveBeenCalledWith(message);
    });
  });
});
