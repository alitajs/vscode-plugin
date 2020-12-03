// @ts-ignore
import { request } from 'alita';

export async function query(): Promise<any> {
  return request('https://raw.githubusercontent.com/alitajs/templates/master/templates.json?raw=true');
}