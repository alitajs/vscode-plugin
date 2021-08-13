import axios from 'axios';
import * as vscode from 'vscode';
import { getDirFileList, getPackageFileList } from './githubApi';

export async function downloadGithubFileItem(
  prefix: string,
  { type, download_url, path },
  targetDir,
) {
  if (type === 'file') {
    const result = await axios.get(download_url, { method: 'GET' });
    const targetPath = path.slice(prefix.length);
    console.log(
      'vscode.workspace.workspaceFile',
      vscode.workspace.workspaceFolders[0].uri
    );
    const targetUri = vscode.Uri.joinPath(
      vscode.workspace.workspaceFolders[0].uri,
      targetDir,
      targetPath
    );
    vscode.workspace.fs.writeFile(targetUri, Buffer.from(result.data, 'utf-8'));
  } else if (type === 'dir') {
    const fileList = await getDirFileList(path);
    fileList.forEach((fileItem) => {
      downloadGithubFileItem(prefix, fileItem, targetDir);
    });
  }
}

export async function downloadPackage(packageName: string, targetDir) {
  const fileList = await getPackageFileList(packageName);
  fileList.forEach((fileItem) => {
    downloadGithubFileItem(`${packageName}/src/pages`, fileItem, targetDir);
  });
}
