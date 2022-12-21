export class InvalidSubscriptionIdException extends Error {
  constructor(subscriptionId: string) {
    super(
      `Cannot unsubscribe using id:${subscriptionId}. Subscription does not exist`,
    );
    this.name = this.constructor.name;
  }
}
