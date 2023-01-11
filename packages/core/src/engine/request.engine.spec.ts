import { RequestEngine } from "./request.engine";
import { Test } from "@nestjs/testing";
import { MessageRequestState, MessageType } from "../cqrs.constants";
import { MessageRequest } from "../classes/message-request.class";
import { faker } from "@faker-js/faker";
import { IPrePublishMiddleware } from "../interfaces/prepublish-middleware.interface";
import { IMessage } from "../interfaces/message.interface";
import { PrePublishMiddleware } from "../decorators/pre-publish-middleware.decorator";
import { DiscoveryService } from "@nestjs/core";
import { Controller, ExceptionFilter } from "@nestjs/common";
import { CQRSFilter } from "../decorators/cqrs-filter.decorator";
import { IPublisher } from "../interfaces/publisher.interface";
import { MessagePublisher } from "../publishers/message.publisher";
import { Message } from "../classes/_base.message";
import { PreProcessMiddleware } from "../decorators/pre-process-middleware.decorator";
import { IPreProcessMiddleware } from "../interfaces/preprocess-middleware.interface";
import { MessageListener } from "../decorators/message-listener.decorator";
import { IngestControllerEngine } from "./ingest-controller.engine";

describe("RequestEngine", () => {
  let engine: RequestEngine;
  let preMiddleware: TestPreMiddleware;
  let scopedPreMiddleware: ScopedTestPreMiddleware;
  let processMiddleware: TestProcessMiddleware;
  let scopedProcessMiddleware: ScopedTestProcessMiddleware;
  let filter: ExceptionFilter;
  let publisher: IPublisher;
  let controller: TestController;

  class TestMessage extends Message implements IMessage {
    public $payload: Record<string, unknown> = {};
  }

  @PrePublishMiddleware()
  class TestPreMiddleware implements IPrePublishMiddleware {
    apply(message: IMessage): IMessage | Promise<IMessage> {
      return message;
    }
  }

  @PrePublishMiddleware(TestMessage)
  class ScopedTestPreMiddleware implements IPrePublishMiddleware {
    apply(message: IMessage): IMessage | Promise<IMessage> {
      return message;
    }
  }

  @PreProcessMiddleware()
  class TestProcessMiddleware implements IPreProcessMiddleware {
    apply(message: IMessage): IMessage | Promise<IMessage> {
      return message;
    }
  }

  @PreProcessMiddleware(TestMessage)
  class ScopedTestProcessMiddleware implements IPreProcessMiddleware {
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

  @Controller()
  class TestController {
    public fn: jest.Mock;

    constructor() {
      this.fn = jest.fn();
    }

    @MessageListener(TestMessage)
    handleTestMessage(message: TestMessage) {
      this.fn(message);
    }
  }
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        RequestEngine,
        TestPreMiddleware,
        DiscoveryService,
        TestFilter,
        ScopedTestPreMiddleware,
        TestProcessMiddleware,
        ScopedTestProcessMiddleware,
        IngestControllerEngine,
        {
          provide: MessagePublisher,
          useValue: {
            publish: jest.fn(),
          },
        },
      ],
      controllers: [TestController],
    }).compile();

    engine = module.get(RequestEngine);
    preMiddleware = module.get(TestPreMiddleware);
    scopedPreMiddleware = module.get(ScopedTestPreMiddleware);
    processMiddleware = module.get(TestProcessMiddleware);
    scopedProcessMiddleware = module.get(ScopedTestProcessMiddleware);
    filter = module.get(TestFilter);
    publisher = module.get(MessagePublisher);
    controller = module.get(TestController);

    module.get(IngestControllerEngine).onApplicationBootstrap();
    engine.onApplicationBootstrap();
  });

  it("will be defined", () => {
    expect(engine).toBeDefined();
  });

  describe("handleMessageRequest to publish", () => {
    let message: MessageRequest;

    beforeEach(() => {
      message = new MessageRequest(
        {
          $metadata: {
            $timestamp: new Date(),
          },
          $name: "TestMessage",
          $payload: {},
          $uuid: faker.datatype.uuid(),
        },
        MessageType.EVENT,
      );
      message["state"] = MessageRequestState.INITIATED;
    });

    it(`will transition the state of the message request to ${MessageRequestState.PUBLISH}`, async () => {
      await engine.handleMessageRequest(message);
      expect(message.STATE).toEqual(MessageRequestState.PUBLISH);
    });

    it("will apply global prepublish middleware functions", async () => {
      const preSpy = jest.spyOn(preMiddleware, "apply");
      await engine.handleMessageRequest(message);

      expect(preSpy).toHaveBeenCalledTimes(1);
      expect(preSpy).toHaveBeenCalledWith(message.message);
    });

    it("will apply local prepublish middleware functions", async () => {
      const preSpy = jest.spyOn(scopedPreMiddleware, "apply");
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
  describe("handleMessageRequest from ingest", () => {
    let message: MessageRequest;
    beforeEach(() => {
      message = new MessageRequest(
        {
          $metadata: {
            $timestamp: new Date(),
          },
          $name: "TestMessage",
          $payload: {},
          $uuid: faker.datatype.uuid(),
        },
        MessageType.EVENT,
      );
      message["state"] = MessageRequestState.INGESTED;
    });

    it("will apply global preprocess middleware", async () => {
      const globalSpy = jest.spyOn(processMiddleware, "apply");
      await engine.handleMessageRequest(message);
      expect(globalSpy).toHaveBeenCalledTimes(1);
      expect(globalSpy).toHaveBeenCalledWith(message.message);
    });

    it("will apply local preprocess middleware", async () => {
      const preSpy = jest.spyOn(scopedProcessMiddleware, "apply");
      await engine.handleMessageRequest(message);

      expect(preSpy).toHaveBeenCalledTimes(1);
      expect(preSpy).toHaveBeenCalledWith(message.message);
    });

    it("will apply process functions", async () => {
      await engine.handleMessageRequest(message);

      expect(controller.fn).toHaveBeenCalledTimes(1);
      expect(controller.fn).toHaveBeenCalledWith(message.message);
    });
  });
});
