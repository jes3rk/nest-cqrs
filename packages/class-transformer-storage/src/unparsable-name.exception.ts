export class UnparsableNameException extends Error {
  constructor(object: Record<string, any>) {
    super(`Cannot parse "name" field from object ${object}`);
    this.name = this.constructor.name;
  }
}
