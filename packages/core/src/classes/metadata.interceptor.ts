import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { ClsService } from "nestjs-cls";
import { Observable } from "rxjs";
import { RequestMetadata } from "../interfaces/request.metadata";
import { Request } from "express";
import { REQUEST_CLIENT_HEADER, REQUEST_METADATA } from "../cqrs.constants";

@Injectable()
export class MetadataInterceptor implements NestInterceptor {
  constructor(private readonly cls: ClsService) {}

  public intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    const request: Request = context.switchToHttp().getRequest();
    const metadata: RequestMetadata = {
      $initiatorClientId: request.header(REQUEST_CLIENT_HEADER),
      $initiatorUserId: request["user"]?.id,
    };
    this.cls.set(REQUEST_METADATA, metadata);
    return next.handle();
  }
}
