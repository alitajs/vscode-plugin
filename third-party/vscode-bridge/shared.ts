export type HandlerType = (
  data: any,
  responseCallback: (response: any) => void
) => void;

export interface BridgeEvent {
  handlerName: string;
  data: any;
  callbackId?: number;
}

export const CALLBACK_HANDLER_NAME = '$$callbackHandler';