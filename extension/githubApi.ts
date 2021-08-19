import axios from 'axios';

function getRepoDirAPIURL(repoOrg: string, repoName: string, dir: string) {
  return `https://api.github.com/repos/${repoOrg}/${repoName}/contents/${dir}`;
}

export async function getDirFileList({ repoOrg, repoName, dir }) {
  const url = getRepoDirAPIURL(repoOrg, repoName, dir);
  const result = await axios(url, { method: 'get' });
  return result.data;
}
