import * as vscode from 'vscode';
import ReusableWebviewPannel from './ReusableWebviewPanel';

export function openTemplateDoc(tpl: any) {
  const panel = ReusableWebviewPannel.create(
    'alita.templateDoc',
    `${tpl.name || ''}文档`,
    vscode.ViewColumn.One,
    {
      enableScripts: true,
    }
  );

  panel.webview.html = getWebviewHtml(tpl);
}

function getWebviewHtml(tpl: any) {
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${tpl.name}文档</title>
  </head>
  <body>
    <div  style="min-width: 1320px; overflow-x:auto; padding: 20px">
      <iframe
      src="${tpl.previewUrl}"
      frameborder="0"
      style="width: 375px; height: 667px"
    ></iframe>
    </div>
  </body>
</html>
  `;
}