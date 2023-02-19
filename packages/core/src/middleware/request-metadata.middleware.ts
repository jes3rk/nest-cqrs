import { ClsService } from "nestjs-cls";
import { REQUEST_METADATA } from "../cqrs.constants";
import { PrePublishMiddleware } from "../decorators/pre-publish-middleware.decorator";
import { IEvent } from "../interfaces/event.interface";
import { IMessage } from "../interfaces/message.interface";
import { IPrePublishMiddleware } from "../interfaces/prepublish-middleware.interface";
import { RequestMetadata } from "../interfaces/request.metadata";

@PrePublishMiddleware()
export class RequestMetadataMiddleware implements IPrePublishMiddleware {
  constructor(private readonly cls: ClsService) {}

  apply(message: IEvent): IMessage | Promise<IMessage> {
    const metadata = this.cls.get<RequestMetadata>(REQUEST_METADATA);
    if (!metadata) return message;
    message.$metadata = { ...metadata, ...message.$metadata };
    return message;
  }
}
