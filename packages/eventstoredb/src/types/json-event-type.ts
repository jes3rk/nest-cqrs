import { MetadataType } from "@eventstore/db-client";

export interface JSONEvent {
  id: string;
  contentType: "application/json";
  type: string;
  data: Record<string, unknown>;
  metadata: MetadataType;
}
