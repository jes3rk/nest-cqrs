export const AGGREGATE_METADATA = "__aggregate-metadata__";
export const APPLY_METADATA = "__apply-metadata__";
export const EVENT_PUBLISHER = "__event-publisher__";
export const EVENT_READER = "__event-reader__";
export const EXCEPTION_FILTER_METADATA = "__filter__";
export const PREPUBLISH_MIDDLEWARE_METADATA = "__prepublish-middleware__";
export const REQUEST_METADATA = "__request-metadata__";

export enum MessageRequestState {
  INITIATED = "INITIATED",
  APPLY_PREPUBLISH_MIDDLEWARE = "APPLY_PREPUBLISH_MIDDLEWARE",
  PUBLISH = "PUBLISH",
  INGESTED = "INGESTED",
  APPLY_PREPROCESS_MIDDLEWARE = "APPLY_PREPROCESS_MIDDLEWARE",
  PROCESS = "PROCESS",
  APPLY_FILTERS = "APPLY_FILTERS",
}

export enum MessageType {
  EVENT = "EVENT",
}
