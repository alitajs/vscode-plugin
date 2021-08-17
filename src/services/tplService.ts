// @ts-ignore
import { request } from 'alita';

export async function queryAlipayTpl(): Promise<any> {
  return request('https://raw.githubusercontent.com/alitajs/templates/master/templates.json?raw=true');
}