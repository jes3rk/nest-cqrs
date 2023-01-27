import { PluginConfiguration } from "./plugin-config.interface";

export interface CQRSModuleConfig {
  applicationName: string;
  includeCLS?: boolean;
  eventStoreConfig: PluginConfiguration;
}
