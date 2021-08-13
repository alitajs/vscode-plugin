import axios from 'axios'
import { TEMPLATE_REPO_ORG, TEMPLATE_REPO_NAME } from './constants';

export async function getDirFileList(dir: string) {
  const url = `https://api.github.com/repos/${TEMPLATE_REPO_ORG}/${TEMPLATE_REPO_NAME}/contents/${dir}`;
  const result = await axios(url, { method: 'get' });
  return result.data;
}

export function getPackageFileList(packageName: string) {
  return getDirFileList(`${packageName}/src/pages`);
}
