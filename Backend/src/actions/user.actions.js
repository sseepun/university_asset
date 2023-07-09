import { API_URL } from './variables';
import {
  USER_SIGNIN, USER_SIGNOUT, USER_UPDATE,
} from './types';
import { alertChange, alertLoading } from './alert.actions';
import { apiHeader, apiHeaderFormData } from '../helpers/header';

import CryptoJS from 'crypto-js';
import { CDN_URL, TOKEN_KEY, REFRESH_KEY } from '../actions/variables';
import { FileModel } from '../models';


export const userFileUpload = (file, loading=false, path='', resize=0) => async (dispatch) => {
  return new Promise(async (resolve, reject) => {
    if(loading) dispatch(alertLoading(true));
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      let url = `${CDN_URL}file/single`;
      if(path){
        url += `/${path}`;
        if(resize) url += `/${resize}`;
      }
      const fetch1 = await fetch(url, {
        method: 'POST',
        headers: apiHeaderFormData(),
        body: formData
      });
      const data1 = await fetch1.json();
      if(!fetch1.ok || fetch1.status !== 200){
        if(loading) dispatch(alertChange('Warning', data1.message, data1.error));
        reject(data1); return false;
      }
      
      let result = new FileModel(data1.data.file);
      if(loading) dispatch(alertLoading(false));
      resolve(result); return true;
    } catch (err) {
      console.log(err);
      if(loading) dispatch(alertLoading(false));
      reject(err); return false;
    }
  });
};


export const userSignin = (input) => async (dispatch) => {
  dispatch(alertLoading(true));
  const fetch1 = await fetch(`${API_URL}auth/signin`, {
    method: 'POST',
    headers: apiHeader(),
    body: JSON.stringify(input),
  });
  const data1 = await fetch1.json();
  if(!fetch1.ok || fetch1.status !== 200) {
    dispatch(alertChange('Warning', data1.message, data1.error));
    return false;
  }

  const user = data1.data.user;
  const accessToken = CryptoJS.AES.encrypt(data1.data.accessToken, TOKEN_KEY).toString();
  const refreshToken = CryptoJS.AES.encrypt(data1.data.refreshToken, REFRESH_KEY).toString();
  
  dispatch(alertChange('Info', 'เข้าสู่ระบบสำเร็จแล้ว'));
  dispatch({
    type: USER_SIGNIN,
    payload: {
      user: user,
      accessToken: accessToken,
      refreshToken: refreshToken
    }
  });
  return true;
};
export const userSignout = () => async (dispatch) => {
  dispatch(alertLoading(true));
  await fetch(`${API_URL}user/signout`, {
    method: 'PATCH',
    headers: apiHeader()
  });
  dispatch(alertChange('Info', 'ออกจากระบบสำเร็จแล้ว'));
  dispatch({ type: USER_SIGNOUT, payload: true });
  return true;
};

export const userForgetPassword = (input) => async (dispatch) => {
  dispatch(alertLoading(true));
  const fetch1 = await fetch(`${API_URL}auth/forget-password`, {
    method: 'POST',
    headers: apiHeader(),
    body: JSON.stringify(input),
  });
  const data1 = await fetch1.json();
  if(!fetch1.ok || fetch1.status !== 200) {
    dispatch(alertChange('Warning', data1.message, data1.error));
    return false;
  }
  
  dispatch(alertChange('Info', 'ขอการตั้งรหัสผ่านใหม่สำเร็จแล้ว'));
  return true;
};
export const userCheckResetPassword = (token) => async (dispatch) => {
  return new Promise(async (resolve, reject) => {
    dispatch(alertLoading(true));
    const fetch1 = await fetch(`${API_URL}auth/check-reset-token?resetToken=${token}`, {
      method: 'GET',
      headers: apiHeader()
    });
    dispatch(alertLoading(false));
    if(!fetch1.ok || fetch1.status !== 200) {
      resolve(false);
    } else {
      resolve(true);
    }
  });
};
export const userResetPassword = (input) => async (dispatch) => {
  return new Promise(async (resolve, reject) => {
    dispatch(alertLoading(true));
    const fetch1 = await fetch(`${API_URL}auth/reset-password`, {
      method: 'PATCH',
      headers: apiHeader(),
      body: JSON.stringify(input)
    });
    const data1 = await fetch1.json();
    if(!fetch1.ok || fetch1.status !== 200) {
      dispatch(alertChange('Warning', data1.message, data1.error));
      resolve(false);
    } else {
      dispatch(alertChange('Info', 'การตั้งรหัสผ่านใหม่สำเร็จแล้ว'));
      resolve(true);
    }
  });
};

export const userUpdate = (type, input) => async (dispatch) => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch(alertLoading(true));

      const fetch1 = await fetch(`${API_URL}user/${type}`, {
        method: 'PATCH',
        headers: apiHeader(),
        body: JSON.stringify(input)
      });
      const data1 = await fetch1.json();
      if(!fetch1.ok || fetch1.status !== 200){
        dispatch(alertChange('Warning', data1.message, data1.error? data1.error: []));
        reject(data1); return false;
      }

      if(type === 'account'){
        dispatch({ type: USER_UPDATE, payload: input });
      }
      
      dispatch(alertChange('Info', data1.message));
      resolve(data1);
    } catch (err) {
      console.log(err);
      dispatch(alertChange('Danger', 'Internal server error.'));
      reject(err);
    }
  });
};
