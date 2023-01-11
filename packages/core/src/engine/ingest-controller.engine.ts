import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { DiscoveryService } from "@nestjs/core";
import { INGEST_ENDPOINT_METADATA } from "../cqrs.constants";
import { IMessage } from "../interfaces/message.interface";
import { initializeAndAddToArrayMap } from "../cqrs.utilites";

type HandlerFn<T extends IMessage> = (message: T) => void | Promise<void>;

@Injectable()
export class IngestControllerEngine implements OnApplicationBootstrap {
  private ingestControllerMap: Map<IMessage["$name"], HandlerFn<IMessage>[]>;

  constructor(private readonly discovery: DiscoveryService) {
    this.ingestControllerMap = new Map();
  }

  public getControllerEndpointsForMessageName(
    name: IMessage["$name"],
  ): HandlerFn<IMessage>[] {
    return this.ingestControllerMap.get(name) || [];
  }

  public onApplicationBootstrap() {
    this.discovery.getControllers().forEach((wrapper) => {
      const { instance } = wrapper;
      if (!instance) return;
      Reflect.ownKeys(Object.getPrototypeOf(instance)).forEach((methodName) => {
        const eventNames: IMessage["$name"][] = Reflect.getMetadata(
          INGEST_ENDPOINT_METADATA,
          instance[methodName],
        );
        if (!eventNames) return;
        eventNames.forEach((name) => {
          initializeAndAddToArrayMap(
            this.ingestControllerMap,
            name,
            instance[methodName].bind(instance),
          );
        });
      });
    });
  }
}
