import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WsResponse,
} from "@nestjs/websockets";
import {
  EventListenerFactory,
  IEvent,
  InjectSubscriberFactory,
  SubscriberFactory,
} from "@nest-cqrs/core";
import { filter, map, Observable } from "rxjs";

@WebSocketGateway()
export class VoyageGateway {
  constructor(
    @InjectSubscriberFactory("voyage")
    private readonly subscriberFactory: SubscriberFactory,
  ) {}

  @SubscribeMessage("voyage/by_client_id")
  handleMessage(
    @MessageBody("clientId") clientId: string,
  ): Observable<WsResponse<IEvent>> {
    return this.subscriberFactory.generateObservable().pipe(
      filter((e) => e.$metadata.$initiatorClientId === clientId),
      map((e) => ({ event: "voyage/by_client_id", data: e })),
    );
  }
}
