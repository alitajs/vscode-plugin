// @ts-ignore
import { request } from 'alita';

export async function queryAlipayTpl(): Promise<any> {
  return request(
    'https://raw.githubusercontent.com/alitajs/templates/master/templates.json?raw=true'
  );
}

export async function getAntdMobilePlusRoutes() {
  return request(
    'https://raw.githubusercontent.com/alitajs/antd-mobile-plus/master/routes.json?raw=true'
  );
}
