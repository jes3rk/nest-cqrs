export class DuplicateVoyageError extends Error {
  constructor() {
    super("Duplicate voyage id");
    this.name = this.constructor.name;
  }
}
