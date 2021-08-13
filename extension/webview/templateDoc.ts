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
    <div  style="min-width: 1320px; overflow-x:auto; height: 100vh">
      <iframe
      src="https://bing.com"
      frameborder="0"
      style="width: 100%; height: 100%"
    ></iframe>
    </div>
  </body>
</html>
  `;
}