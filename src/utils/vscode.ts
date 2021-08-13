let vscode: any;
if (!vscode) {
  vscode = (window as any).acquireVsCodeApi();
}

export default vscode;
