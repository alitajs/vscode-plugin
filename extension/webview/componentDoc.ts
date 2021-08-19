import * as vscode from 'vscode';
import ReusableWebviewPannel from './ReusableWebviewPanel';

export function openComponentDoc(component: any) {
  const panel = ReusableWebviewPannel.create(
    'alita.componentDoc',
    component.title,
    vscode.ViewColumn.One,
    {
      enableScripts: true,
    }
  );
  panel.webview.html = getWebviewHtml(component);
}

function getWebviewHtml(component: any) {
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${component.title}文档</title>
      <style>
        html, 
        body {
          height: 100%;
        }
      </style>
    </head>
    <body>
      <div style="min-width: 1320px; overflow-x:auto; padding: 20px; height: 100%">
        <iframe
        src="https://ui.alitajs.com${component.path}"
        frameborder="0"
        style="width: 100%; height: 100%"
      ></iframe>
      </div>
    </body>
  </html>
`;
}
