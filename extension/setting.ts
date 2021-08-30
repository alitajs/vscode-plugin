import * as vscode from 'vscode';
import { BlockConfig } from '../shared/typings';

const CONFIG_SECTION = 'whaleCloudKit';

export function block() {
  return vscode.workspace.getConfiguration(CONFIG_SECTION).get<Array<BlockConfig>>('block', []);
}