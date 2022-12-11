import { faker } from "@faker-js/faker";
import { Test } from "@nestjs/testing";
import { MessageRequest } from "../classes/message-request.class";
import { EVENT_PUBLISHER, MessageType } from "../cqrs.constants";
import { IPublisher } from "../interfaces/publisher.interface";
import { MessagePublisher } from "./message.publisher";

describe("MessagePublisher", () => {
  let publisher: MessagePublisher;
  let eventPublisher: IPublisher;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MessagePublisher,
        {
          provide: EVENT_PUBLISHER,
          useValue: {
            publish: jest.fn(),
          },
        },
      ],
    }).compile();

    publisher = module.get(MessagePublisher);
    eventPublisher = module.get(EVENT_PUBLISHER);
  });

  it("will be defined", () => {
    expect(publisher).toBeDefined();
  });

  describe("publish", () => {
    it("will publish an event to the correct publisher", async () => {
      const message = MessageRequest.generateRequest(
        {
          $metadata: {},
          $name: "TestEvent",
          $uuid: faker.datatype.uuid(),
        },
        MessageType.EVENT,
      );
      const eventSpy = jest.spyOn(eventPublisher, "publish");

      await publisher.publish(message);

      expect(eventSpy).toHaveBeenCalledTimes(1);
      expect(eventSpy).toHaveBeenCalledWith(message.toPlainMessage());
    });
  });
});
