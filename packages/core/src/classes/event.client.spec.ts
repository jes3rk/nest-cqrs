import { Test } from "@nestjs/testing";
import { MessageType } from "../cqrs.constants";
import { RequestEngine } from "../engine/request.engine";
import { IEvent } from "../interfaces/event.interface";
import { EventClient } from "./event.client";
import { Event } from "./_base.event";

describe("EventClient", () => {
  let eventClient: EventClient;
  let engine: RequestEngine;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        EventClient,
        {
          provide: RequestEngine,
          useValue: {
            handleMessageRequest: jest.fn(),
          },
        },
      ],
    }).compile();

    eventClient = module.get(EventClient);
    engine = module.get(RequestEngine);
  });

  it("will be defined", () => {
    expect(eventClient).toBeDefined();
  });

  describe("emit", () => {
    class TestEvent extends Event implements IEvent {
      public $payload: Record<string, unknown> = {};
    }
    let event: TestEvent;

    beforeEach(() => {
      event = new TestEvent();
    });

    it("will create a message request and pass to the engine", async () => {
      const handleSpy = jest.spyOn(engine, "handleMessageRequest");
      await eventClient.emit(event);

      expect(handleSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          messageType: MessageType.EVENT,
          _message: event,
        }),
      );
    });
  });
});
