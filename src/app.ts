import { ResponseError } from 'umi-request';

export const request = {
  prefix: '',
  method: 'get',
  errorHandler: (error: ResponseError) => {
    // 集中处理错误
    console.log(error);
  },
};
