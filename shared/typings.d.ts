export interface BlockConfig {
  title: string;
  key: string;
  repoType: 'github' | 'gitlab';
  repoOrg: string;
  repoName: string;
  repoURL: string;
}