import * as vscode from 'vscode';
import { HandlerType, BridgeEvent, CALLBACK_HANDLER_NAME } from './shared';

class Bridge {
  constructor({ webview }) {
    this.webview = webview;
    this.listen();
  }

  uniqueId: number = 1;
  webview: vscode.Webview;
  handlers: Map<string, HandlerType> = new Map();
  callbacks: Map<number, (response: any) => void> = new Map();

  static bridgeForWebview(webview: vscode.Webview) {
    const bridge = new Bridge({ webview });
    return bridge;
  }

  sendMessageToWebview(message: BridgeEvent) {
    this.webview.postMessage(message);
  }

  sendResponseToWebview(callbackId: number, response: any) {
    this.sendMessageToWebview({
      handlerName: CALLBACK_HANDLER_NAME,
      data: response,
      callbackId,
    });
  }

  listen() {
    this.webview.onDidReceiveMessage(
      ({ handlerName, data, callbackId }: BridgeEvent) => {
        if (handlerName === CALLBACK_HANDLER_NAME) {
          this.handleReceiveWebviewCallback({ callbackId, data });
          return;
        }
        const fn = this.handlers.get(handlerName);
        if (typeof fn === 'function' && !!fn) {
          fn(data, (response) => {
            this.sendResponseToWebview(callbackId, response);
          });
        }
      }
    );
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
      this.sendMessageToWebview({
        handlerName,
        data,
        callbackId,
      });
    });
  }

  callHandlerNoCallback(handlerName: string, data: any) {
    this.sendMessageToWebview({
      handlerName,
      data,
    });
  }

  handleReceiveWebviewCallback({ callbackId, data }) {
    const fn = this.callbacks.get(callbackId);
    if (typeof fn === 'function' && !!fn) {
      fn(data);
      this.callbacks.delete(callbackId);
    }
  }
}

export default Bridge;
