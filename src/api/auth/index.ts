import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { LoginData, LoginResult } from './types';

/**
 * 定义登录接口 
 * 
 * @param data {LoginData}
 * @returns
 */
export function loginApi(data: LoginData): AxiosPromise<LoginResult> { // AxiosPromise<LoginResult>表示响应数据的类型是LoginResult
  // 也可以return request.post('/api/v1/auth/login',params: data)
  return request({
    url: '/api/v1/auth/login',
    method: 'post',
    params: data
  });
}

/**
 * 注销API
 */
export function logoutApi() {
  return request({
    url: '/api/v1/auth/logout',
    method: 'delete'
  });
}


/**
 * 获取验证码
 */
export function getCaptchaApi(): AxiosPromise<CaptchaResult> {
  return request({
    url: '/api/v1/auth/captcha',
    method: 'get'
  });
}