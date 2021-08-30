import Bridge from '@vscbridge/ext';
import * as vscode from 'vscode';
import fs from 'fs-extra';
import path from 'path';
import { blockRepoPath } from './git';
import { openComponentDoc } from './webview/componentDoc';
import { openTemplateDoc } from './webview/templateDoc';
import * as setting from './setting';

export default class WebviewHandlers {
  constructor(bridge: Bridge, context: vscode.ExtensionContext) {
    this.bridge = bridge;
    // this.context = context;
  }
  private bridge: Bridge;
  // private context: vscode.ExtensionContext;

  register() {
    this.bridge.registerHandler('getBlockConfig', (_, callback) => {
      callback(setting.block());
    });
    this.bridge.registerHandler(
      'getBlockTemplatesJSON',
      this.getBlockTemplatesJSON
    );
    this.bridge.registerHandler('templateSelected', (data) => {
      openTemplateDoc(data.tpl);
    });
    this.bridge.registerHandler('templateDownload', (data) => {
      this.downloadBlock(data);
    });
    this.bridge.registerHandler('componentSelected', (data) => {
      openComponentDoc(data.component);
    });
    this.bridge.registerHandler(
      'getBlockSnapshotUriPrefix',
      (blockConfig, callback) => {
        callback(
          this.bridge.webview
            .asWebviewUri(vscode.Uri.file(blockRepoPath(blockConfig)))
            .toString()
        );
      }
    );
  }

  /**
   * 获取区块 templates.json 文件
   * @param data 区块配置
   * @param callback 回调
   */
  getBlockTemplatesJSON(data: any, callback: Function) {
    // 获取仓库路径
    const repoPath = blockRepoPath(data);
    const resultStr = fs.readFileSync(
      path.join(repoPath, 'templates.json'),
      'utf-8'
    );
    callback(JSON.parse(resultStr));
  }

  downloadBlock(data: any) {
    const { blockKey, pkgItem, routerName } = data;
    if (!vscode.workspace.workspaceFolders) {
      vscode.window.showInformationMessage('请打开项目目录');
      return;
    }
    const targetDir = path.join(
      vscode.workspace.workspaceFolders[0].uri.path,
      routerName
    );
    if (!fs.existsSync(targetDir)) {
      fs.mkdirpSync(targetDir);
    }
    const targetBlock = setting.block().find((item) => item.key === blockKey);
    if (!targetBlock) {
      vscode.window.showErrorMessage('找不到对应区块配置');
      return;
    }
    const repoPath = blockRepoPath(targetBlock);
    const srcDir = path.join(repoPath, pkgItem.path, 'src/pages');
    fs.copy(srcDir, targetDir)
      .then(() => {
        console.log(`copy '${srcDir}' to '${targetDir}' success`);
      })
      .catch((e) => {
        console.error(e);
      });
  }
}
