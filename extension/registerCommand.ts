import * as vscode from 'vscode';
import { openTemplateDoc } from './webview/templateDoc';

function registerCommands(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('alita.openTemplateDoc', (tpl) => {
      openTemplateDoc(tpl);
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand('alita.openConfigPage', () => {
      vscode.commands.executeCommand(
        'workbench.action.openSettings',
        '@id:whaleCloudKit.block'
      );
    })
  );
}

export default registerCommands;
