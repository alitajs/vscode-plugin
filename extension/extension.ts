// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import VSCBridge from '@vscbridge/ext';
import registerCommands from './registerCommand';
import { initRepos, reposPath } from './git';
import WebviewHandlers from './WebviewHandlers';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  registerCommands(context);
  vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: '下载仓库中',
    },
    () => {
      return initRepos(context).then(() => {
        const provider = new TemplatesViewProvider(
          context.extensionUri,
          context
        );
        context.subscriptions.push(
          vscode.window.registerWebviewViewProvider(
            TemplatesViewProvider.viewType,
            provider
          )
        );
      });
    }
  );
}

class TemplatesViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'alita.templatesView';
  public webview?: vscode.WebviewView;
  constructor(
    private readonly _extensionUri: vscode.Uri,
    private readonly _extContext: vscode.ExtensionContext
  ) {}
  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this.webview = webviewView;

    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,

      localResourceRoots: [this._extensionUri, vscode.Uri.file(reposPath())],
    };

    const bridge = new VSCBridge({ webview: webviewView.webview });
    const webviewHandlers = new WebviewHandlers(bridge, this._extContext);
    webviewHandlers.register();

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
  }
  private _getHtmlForWebview(webview: vscode.Webview) {
    // Get the local path to main script run in the webview, then convert it to a uri we can use in the webview.
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'dist', 'umi.js')
    );

    // Do the same for the stylesheet.
    const umiCssUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'dist', 'umi.css')
    );

    // Use a nonce to only allow a specific script to be run.
    const nonce = getNonce();

    return `<!DOCTYPE html>
		<html>
			<head>
				<meta charset="utf-8" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no"
				/>
				<meta content="telephone=no" name="format-detection" />
				<style>
					* {
						padding: 0;
						margin: 0;
						box-sizing: border-box;
					}
					html,
					body,
					#root {
						height: 100%;
						width: 100%;
					}
					body {
						-webkit-touch-callout: none;
						-webkit-user-select: none;
						-khtml-user-select: none;
						-moz-user-select: none;
						-ms-user-select: none;
						user-select: none;
						-webkit-overflow-scrolling: touch;
						padding: 0 0;
					}
					input {
						border: none;
						outline: none;
					}
					#root {
						position: relative;
						overflow: scroll;
					}
					textarea:disabled,
					input:disabled {
						background-color: transparent;
					}
				</style>
				<link rel="stylesheet" href="${umiCssUri}" />
				<script>
					window.routerBase = "/";
				</script>
				<script>
					//! umi version: 3.2.25
				</script>
			</head>
			<body>
				<div id="root"></div>
		
				<script>
					// window.console.log = () => {};
					// window.console.info = () => {};
					// window.console.warn = () => {};
					// window.console.error = () => {};
				</script>
				<script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
		</html>
		`;
  }
}

function getNonce() {
  let text = '';
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

// this method is called when your extension is deactivated
export function deactivate() {}
