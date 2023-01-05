// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IMessageMetadata {
  $timestamp: Date;
}

export interface IMessage {
  $metadata: IMessageMetadata;
  $name: string;
  $payload: unknown;
  $uuid: string;
}
