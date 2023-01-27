import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
} from "@nestjs/websockets";
import {
  IEvent,
  InjectSubscriberFactory,
  SubscriberFactory,
} from "@nest-cqrs/core";
import { filter, map, Observable } from "rxjs";

@WebSocketGateway()
export class AccountingGateway {
  constructor(
    @InjectSubscriberFactory("accounting")
    private readonly subscriberFactory: SubscriberFactory,
  ) {}

  @SubscribeMessage("account/by_id")
  handleAccountById(@MessageBody() id: string): Observable<WsResponse<IEvent>> {
    const observable = this.subscriberFactory.generateObservable();
    return observable.pipe(
      filter((e) => e.$streamId.includes(id)),
      map((data) => ({
        event: "account/by_id",
        data,
      })),
    );
  }

  @SubscribeMessage("account/by_client_id")
  handleAccountByClientId(
    @MessageBody("clientId") clientId: string,
  ): Observable<WsResponse<IEvent>> {
    const observable = this.subscriberFactory.generateObservable();
    return observable.pipe(
      filter((e) => e.$metadata.$initiatorClientId === clientId),
      map((data) => ({ event: "account/by_client_id", data })),
    );
  }
}
