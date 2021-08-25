// 内置的区块库
export const BLOCK_BUILD_IN_KEY = 'alipay';
export const BLOCK_GOV_KEY = 'gov-block';

export const BLOCK_DATA = [
  {
    title: '支付宝',
    key: BLOCK_BUILD_IN_KEY,
    repoType: 'github',
    repoOrg: 'alitajs',
    repoName: 'templates',
    repoURL: 'https://github.com/alitajs/templates.git',
  },
  {
    title: '政企',
    key: BLOCK_GOV_KEY,
    repoType: 'gitlab',
    repoOrg: 'seal/componentkit',
    repoName: 'gov-common-page',
    repoURL: 'http://gitlab.iwhalecloud.com/seal/componentkit/gov-common-page.git',
  }
];