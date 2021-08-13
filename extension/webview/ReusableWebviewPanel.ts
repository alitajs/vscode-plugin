import * as vscode from 'vscode';

module ReusableWebviewPannel {
  const webviewPanelPool: Map<string, vscode.WebviewPanel> = new Map(); // webviewPanel 池

  /**
   * 创建 webviewPanel
   * @param viewType 唯一标识
   * @param title 标题
   * @param showOptions 显示位置
   * @param options 可选选项
   */
  export function create(
    viewType: string,
    title:string,
    showOptions = vscode.ViewColumn.Active,
    options: vscode.WebviewPanelOptions & vscode.WebviewOptions
  ) {
    const oldPanel = webviewPanelPool.get(viewType);

    if (oldPanel) {
      oldPanel.title = title;
      oldPanel.reveal();
      return oldPanel;
    }

    const newPanel = vscode.window.createWebviewPanel(viewType, title, showOptions, options);

    newPanel.onDidDispose(() => {
      webviewPanelPool.delete(viewType);
    });
    webviewPanelPool.set(viewType, newPanel);

    return newPanel;
  }

  /**
   * 销毁 webviewPanel
   * @param viewType 唯一标识
   */
  export function destory(viewType: string) {
    const panel = webviewPanelPool.get(viewType);

    if (panel) {
      webviewPanelPool.delete(viewType);
      // createWebviewPanel是异步的，setTimeout避免创建未完成时调用dispose报错 (这个是参考其他项目，提到这点)
      setTimeout(() => {
        panel.dispose();
      }, 0);
    }
  }
};

export default ReusableWebviewPannel;