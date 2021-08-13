import * as vscode from 'vscode';
import ReusableWebviewPannel from './ReusableWebviewPanel';

export function openTemplateDoc(templateName: string) {
  const panel = ReusableWebviewPannel.create(
    'alita.templateDoc',
    `${templateName || ''}文档`,
    vscode.ViewColumn.One,
    {
      enableScripts: true,
    }
  );

  panel.webview.html = getWebviewHtml(templateName);
}

function getWebviewHtml(templateName: string) {
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${templateName}文档</title>
  </head>
  <body>
    <div  style="min-width: 1320px; overflow-x:auto; padding: 20px">
      <iframe
      src="https://templates.alitajs.com/#/${templateName}"
      frameborder="0"
      style="width: 375px; height: 667px"
    ></iframe>
    </div>
  </body>
</html>
  `;
}