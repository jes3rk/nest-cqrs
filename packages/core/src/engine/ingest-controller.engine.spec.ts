import { faker } from "@faker-js/faker";
import { Controller } from "@nestjs/common";
import { DiscoveryService } from "@nestjs/core";
import { Test } from "@nestjs/testing";
import { MessageRequest } from "../classes/message-request.class";
import { Message } from "../classes/_base.message";
import { MessageRequestState, MessageType, NAMESPACE } from "../cqrs.constants";
import { MessageListener } from "../decorators/message-listener.decorator";
import { PreProcessMiddleware } from "../decorators/pre-process-middleware.decorator";
import { IMessage } from "../interfaces/message.interface";
import { IPreProcessMiddleware } from "../interfaces/preprocess-middleware.interface";
import { IngestControllerEngine } from "./ingest-controller.engine";

describe("IngestControllerEngine", () => {
  const namespace = faker.random.alphaNumeric(4);

  let engine: IngestControllerEngine;
  let processMiddleware: IPreProcessMiddleware;
  let scopedProcessMiddleware: IPreProcessMiddleware;
  let controller: TestController;

  class TestMessage extends Message implements IMessage {
    public $payload: Record<string, unknown> = {};
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
        IngestControllerEngine,
        DiscoveryService,
        TestProcessMiddleware,
        ScopedTestProcessMiddleware,
        {
          provide: NAMESPACE,
          useValue: namespace,
        },
      ],
      controllers: [TestController],
    }).compile();

    processMiddleware = module.get(TestProcessMiddleware);
    scopedProcessMiddleware = module.get(ScopedTestProcessMiddleware);
    controller = module.get(TestController);

    engine = module.get(IngestControllerEngine);
    engine.onApplicationBootstrap();
  });

  it("will be defined", () => {
    expect(engine).toBeDefined();
  });

  describe("handleIngestRequest", () => {
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
      message["_namespace"] = namespace;
      message["state"] = MessageRequestState.INGESTED;
    });

    it("will apply global preprocess middleware", async () => {
      const globalSpy = jest.spyOn(processMiddleware, "apply");
      await engine.handleIngestRequest(message);
      expect(globalSpy).toHaveBeenCalledTimes(1);
      expect(globalSpy).toHaveBeenCalledWith(message.message);
    });

    it("will apply local preprocess middleware", async () => {
      const preSpy = jest.spyOn(scopedProcessMiddleware, "apply");
      await engine.handleIngestRequest(message);

      expect(preSpy).toHaveBeenCalledTimes(1);
      expect(preSpy).toHaveBeenCalledWith(message.message);
    });

    it("will apply process functions", async () => {
      await engine.handleIngestRequest(message);

      expect(controller.fn).toHaveBeenCalledTimes(1);
      expect(controller.fn).toHaveBeenCalledWith(message.message);
    });
  });
});
