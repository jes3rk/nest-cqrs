export abstract class Message {
  public readonly name: string;

  constructor() {
    this.name = this.constructor.name;
  }
}
