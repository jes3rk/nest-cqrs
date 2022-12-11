// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IMessageMetadata {}

export interface IMessage {
  $metadata: IMessageMetadata;
  $name: string;
  $uuid: string;
}
