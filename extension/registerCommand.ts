import * as vscode from 'vscode';
import { openTemplateDoc } from './webview/templateDoc';

function registerCommands(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('alita.openTemplateDoc', (templateName) => {
      openTemplateDoc(templateName);
    })
  );
}

export default registerCommands;
