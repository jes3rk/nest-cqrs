import { Test } from "@nestjs/testing";
import { InvalidSubscriptionIdException } from "./invalid-subscription-id.exception";
import { Message } from "./message.class";
import { MessengerService } from "./messenger.service";

describe("MessengerService", () => {
  let service: MessengerService;

  class TestMessage extends Message {}

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [MessengerService],
    }).compile();

    service = module.get(MessengerService);
  });

  it("will be defined", () => {
    expect(service).toBeDefined();
  });

  it("will store subscribers", () => {
    const handler = jest.fn();

    expect(service.subscribe(TestMessage, handler)).toEqual(expect.any(String));
    expect(service["subscriptions"].size).toEqual(1);
  });

  it("will emit messages to subscribers", () => {
    const msg = new TestMessage();
    const handler = jest.fn();

    service.subscribe(TestMessage, handler);
    service.emit(msg);

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(msg);
  });

  it("will allow unsubscribing", () => {
    const msg = new TestMessage();
    const handler = jest.fn();

    const subId = service.subscribe(TestMessage, handler);
    service.emit(msg);
    service.unsubscribe(subId);
    service.emit(msg);

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(msg);
  });

  it("will throw an error if invalid subscription id when unsubscribing", () => {
    expect(() => service.unsubscribe("")).toThrowError(
      InvalidSubscriptionIdException,
    );
  });
});
