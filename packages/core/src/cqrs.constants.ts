export const EVENT_PUBLISHER = "__event-publisher__";
export const EXCEPTION_FILTER_METADATA = "__filter__";
export const PREPUBLISH_MIDDLEWARE_METADATA = "__prepublish-middleware__";

export enum MessageRequestState {
  INITIATED = "INITIATED",
  APPLY_PREPUBLISH_MIDDLEWARE = "APPLY_PREPUBLISH_MIDDLEWARE",
  PUBLISH = "PUBLISH",
  APPLY_PREPROCESS_MIDDLEWARE = "APPLY_PREPROCESS_MIDDLEWARE",
  PROCESS = "PROCESS",
  APPLY_FILTERS = "APPLY_FILTERS",
}

export enum MessageType {
  EVENT = "EVENT",
}
