import { BridgeEvent, CALLBACK_HANDLER_NAME, HandlerType } from "./shared";

let vscode: any;
if (!vscode) {
  vscode = (window as any).acquireVsCodeApi?.();
}

class Bridge {
  constructor() {
    this.listen();
  }

  uniqueId: number = 1;
  handlers: Map<string, HandlerType> = new Map();
  callbacks: Map<number, (response: any) => void> = new Map();

  sendMessageToExtension(message: BridgeEvent) {
    vscode?.postMessage(message);
  }

  sendResponseToExtension(callbackId: number, response: any) {
    this.sendMessageToExtension({
      handlerName: CALLBACK_HANDLER_NAME,
      data: response,
      callbackId,
    });
  }

  listen() {
    window.addEventListener('message', (event) => {
      const message: BridgeEvent = event.data;
      if (message.handlerName === CALLBACK_HANDLER_NAME) {
        this.handleReceiveExtensionCallback({ callbackId: message.callbackId, data: message.data });
        return;
      }
      const fn = this.handlers.get(message.handlerName);
      if (typeof fn === 'function' && !!fn) {
        fn(message.data, (response) => {
          this.sendResponseToExtension(message.callbackId, response);
        });
      }
    });
  }

  registerHandler(handlerName: string, handler: HandlerType) {
    this.handlers.set(handlerName, handler);
  }

  callHandler(handlerName: string, data: any) {
    return new Promise((resolve) => {
      this.uniqueId += 1;
      const callbackId = this.uniqueId;
      this.callbacks.set(callbackId, (response) => {
        resolve(response);
      });
      this.sendMessageToExtension({
        handlerName,
        data,
        callbackId,
      });
    });
  }

  handleReceiveExtensionCallback({ callbackId, data }) {
    const fn = this.callbacks.get(callbackId);
    if (typeof fn === 'function' && !!fn) {
      fn(data);
      this.callbacks.delete(callbackId);
    }
  }
}

const vscBridge = new Bridge();

export default vscBridge;