import { Inject } from "@nestjs/common";

/**
 * Inject the subscriber factory for the specified namespace
 */
export const InjectSubscriberFactory = (namespace: string) =>
  Inject(`SubscriberFactory::${namespace}`);
