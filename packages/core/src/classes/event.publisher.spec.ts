import { Test } from "@nestjs/testing";
import { MessageType } from "../cqrs.constants";
import { RequestEngine } from "../engine/request.engine";
import { IEvent } from "../interfaces/event.interface";
import { EventPublisher } from "./event.publisher";
import { Event } from "./_base.event";

describe("EventPublisher", () => {
  let eventPublisher: EventPublisher;
  let engine: RequestEngine;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        EventPublisher,
        {
          provide: RequestEngine,
          useValue: {
            handleMessageRequest: jest.fn(),
          },
        },
      ],
    }).compile();

    eventPublisher = module.get(EventPublisher);
    engine = module.get(RequestEngine);
  });

  it("will be defined", () => {
    expect(eventPublisher).toBeDefined();
  });

  describe("emit", () => {
    class TestEvent extends Event implements IEvent {}
    let event: TestEvent;

    beforeEach(() => {
      event = new TestEvent();
    });

    it("will create a message request and pass to the engine", async () => {
      const handleSpy = jest.spyOn(engine, "handleMessageRequest");
      await eventPublisher.emit(event);

      expect(handleSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          messageType: MessageType.EVENT,
          _message: event,
        }),
      );
    });
  });
});
