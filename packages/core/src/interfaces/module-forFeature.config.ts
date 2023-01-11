export interface CQRSModuleForFeature {
  /**
   * Group all modules as a namespace to allow
   * per-namespace distribution of events.
   */
  namespace: string;
}
