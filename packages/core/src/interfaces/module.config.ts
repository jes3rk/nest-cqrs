import { PluginConfiguration } from "./plugin-config.interface";

export interface CQRSModuleConfig {
  includeCLS?: boolean;
  eventStoreConfig: PluginConfiguration;
}
