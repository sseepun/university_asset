import CryptoJS from 'crypto-js';
import { APP_PREFIX, CDN_PUBLIC_KEY, TOKEN_KEY } from '../actions/variables';


export const apiHeader = () => {
  let temp = localStorage.getItem(`${APP_PREFIX}_ACCESS`);
  if(temp) {
    let bytes = CryptoJS.AES.decrypt(temp, TOKEN_KEY);
    let accessToken = bytes.toString(CryptoJS.enc.Utf8);
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    };
  } else {
    return { 'Content-Type': 'application/json' };
  }
}

export const apiHeaderFormData = () => {
  let user = localStorage.getItem(`${APP_PREFIX}_USER`);
  if(user) {
    user = JSON.parse(user);
    return {
      'Authorization': `Bearer ${CDN_PUBLIC_KEY}`
    };
  } else {
    return {};
  }
}
