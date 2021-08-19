import axios from 'axios';
import * as vscode from 'vscode';
import { BLOCK_BUILD_IN_KEY, BLOCK_DATA } from '../shared/constants';
import * as GithubApi from './githubApi';

function getBlockData() {
  return BLOCK_DATA;
}

export async function downloadGithubFileItem(
  srcRoot: string,
  { download_url, path },
  targetDir
) {
  const result = await axios.get(download_url, { method: 'GET' });
  const targetPath = path.slice(srcRoot.length);
  const targetUri = vscode.Uri.joinPath(
    vscode.workspace.workspaceFolders[0].uri,
    targetDir,
    targetPath
  );
  vscode.workspace.fs.writeFile(targetUri, Buffer.from(result.data, 'utf-8'));
}

export async function downloadGithubDir({
  repoOrg,
  repoName,
  dir,
  targetDir,
  srcRoot,
}) {
  const fileList = await GithubApi.getDirFileList({ repoOrg, repoName, dir });
  fileList.forEach((fileItem) => {
    if (fileItem.type === 'file') {
      downloadGithubFileItem(srcRoot, fileItem, targetDir);
    } else if (fileItem.type === 'dir') {
      downloadGithubDir({
        repoOrg,
        repoName,
        dir: fileItem.path,
        targetDir,
        srcRoot,
      });
    }
  });
}

export async function downloadPackage(
  blockKey: string,
  pkgItem: any,
  targetDir
) {
  const blockInfo = getBlockData().find((item) => item.key === blockKey);
  if (!blockInfo) {
    return;
  }
  switch (blockKey) {
    case BLOCK_BUILD_IN_KEY: {
      const { path } = pkgItem;
      const srcRoot = `${path}/src/pages`;
      downloadGithubDir({
        repoOrg: blockInfo.repoOrg,
        repoName: blockInfo.repoName,
        dir: srcRoot,
        targetDir,
        srcRoot,
      });
      break;
    }
    default:
      break;
  }
}
