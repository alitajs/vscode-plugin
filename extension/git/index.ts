import simpleGit, {SimpleGit} from 'simple-git';
import path from 'path';
import fs from 'fs';
import * as vscode from 'vscode';
import { BLOCK_DATA } from '../../shared/constants';


const git: SimpleGit = simpleGit();

let _reposPath: string;

const REPOS_JSON = 'repos_json';

/**
 * 初始化仓库
 * @param context 上下文
 */
export async function initRepos(context: vscode.ExtensionContext) {
  // 在 globalState 目录创建 repos 目录
  _reposPath = path.join(context.globalStorageUri.fsPath, 'repos');
  if (!fs.existsSync(_reposPath)) {
    fs.mkdirSync(_reposPath);
  };

  // 读取区块配置
  const blockData = BLOCK_DATA;

  // 仓库下载状态文件
  // path.join(context.globalStorageUri.fsPath, 'repos.json');
  

  // git clone 仓库
  for (let i = 0; i < blockData.length; i += 1) {
    const blockConfig = blockData[i];
    try {
      await cloneRepo(blockConfig.repoURL, path.join(_reposPath, blockConfig.key));
    } catch (error) {
      console.log(`git clone repo fail: ${blockConfig.repoURL}`);
    }
  }
}

/**
 * git clone 仓库，如果本地已经存在，则 pull 仓库
 * @param url 仓库地址
 * @param localPath 本地路径
 * @returns 
 */
export async function cloneRepo(url: string, localPath: string) {
  // 如果目录已经存在 则 pull 仓库
  if (fs.existsSync(localPath)) {
    await simpleGit(localPath).pull();
    return localPath;
  }
  return git.clone(url, localPath);
}

/**
 * 获取 repos 目录路径
 * @returns repos 目录路径
 */
export function reposPath() {
  return _reposPath;
}

/**
 * 获取区块仓库本地路径
 * @param blockConfig 区块配置
 * @returns 区块仓库本地路径
 */
export function blockRepoPath(blockConfig: any = {}) {
  return path.join(_reposPath, blockConfig.key);
}