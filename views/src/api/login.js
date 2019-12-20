import request from '../utils/request';

export const doLogin = query =>{
  return request({
    url:'./login/dologin',
    method:'get',
    params:query
  })
}