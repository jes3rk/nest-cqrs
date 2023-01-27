import { WebSocket, MessageEvent } from "ws";
import { INestApplication } from "@nestjs/common";
import { Application } from "express";
import { AddressInfo } from "net";
import { EventEmitter } from "events";
import { IEvent } from "@nest-cqrs/core";

/**
 * Listen to and cache events from a websocket
 */
export class WsClient {
  private readonly _ee: EventEmitter;
  private readonly _socket: WebSocket;
  private events: Array<IEvent>;

  constructor(app: INestApplication) {
    const addr = (app.getHttpServer() as Application)
      .listen()
      .address() as AddressInfo;
    this._socket = new WebSocket(`ws://[${addr.address}]:${addr.port}`);
    this._ee = new EventEmitter();
    this.events = [];
    this._socket.onmessage = (message: MessageEvent) => {
      const raw = JSON.parse(message.data.toString());
      this.events.push(raw["data"]);
      this._ee.emit("", raw["data"]);
    };
  }

  private awaitSocketOpen(): Promise<void> {
    if (this._socket.readyState.toString() !== WebSocket.OPEN.toString())
      return new Promise<void>((res) => {
        this._socket.onopen = function () {
          res();
        };
      });
    return;
  }

  public close(): void {
    this._socket.close();
    this._ee.removeAllListeners();
  }

  public listenForEvent<T extends IEvent>(
    filter: (event: IEvent) => boolean,
    timeout = 3000,
  ): Promise<T> {
    const quickReturn = this.events.find((e) => filter(e));
    if (quickReturn) return Promise.resolve(quickReturn as T);
    return new Promise((res, rej) => {
      const _timeout = setTimeout(() => {
        rej("Event timeout");
      }, timeout);
      const handler = (e: IEvent) => {
        if (filter(e)) {
          clearTimeout(_timeout);
          this._ee.removeListener("", handler);
          res(e as T);
        }
      };
      this._ee.addListener("", handler);
    });
  }

  public sendMessage(message: Record<string, unknown>): void {
    this._socket.send(JSON.stringify(message));
  }

  public static async fromApplication(
    app: INestApplication,
  ): Promise<WsClient> {
    const client = new WsClient(app);
    await client.awaitSocketOpen();
    return client;
  }
}
