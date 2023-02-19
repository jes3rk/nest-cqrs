import { PluginConfiguration } from "./plugin-config.interface";

export interface CQRSModuleConfig {
  /**
   * Root namespace of the application
   */
  applicationName: string;
  /**
   * `@nest-cqrs` utilizes the nest-cls package for extracting
   * information from the request object. This parameter enables
   * manual use of CLS for use elsewhere in the application.
   *
   * @default true
   */
  includeCLS?: boolean;
  eventStoreConfig: PluginConfiguration;
}
