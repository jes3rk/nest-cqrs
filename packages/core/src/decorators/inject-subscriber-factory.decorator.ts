import { Inject } from "@nestjs/common";

/**
 * Inject the subscriber factory for the specified namespace
 * @deprecated This is no longer needed
 */
export const InjectSubscriberFactory = (namespace: string) =>
  Inject(`SubscriberFactory::${namespace}`);
