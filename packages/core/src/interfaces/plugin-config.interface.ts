import { Provider } from "@nestjs/common";

export interface PluginConfiguration {
  exports: any[];
  providers: Provider[];
}
