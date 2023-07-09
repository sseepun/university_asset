import { apiHeader } from '../helpers/header';
import { API_URL } from './variables';
import {
  CLIENT_IP, SIDENAV_ACTIVE_INDEX, APP_SETTINGS,
} from './types';


export const updateClientIp = () => async (dispatch) => {
  const fetch1 = await fetch('https://geolocation-db.com/json/');
  const data1 = await fetch1.json();
  dispatch({ 
    type: CLIENT_IP, 
    payload: data1.IPv4 
  });
  return data1.IPv4;
};
export const setSidenavActiveIndex = (index) => (dispatch) => {
  dispatch({
    type: SIDENAV_ACTIVE_INDEX,
    payload: index
  });
  return true;
};


export const updateSettings = (type, option={}) => async (dispatch) => {
  return new Promise(async (resolve, reject) => {
    try {
      const fetch1 = await fetch(`${API_URL}app/settings`, {
        method: 'GET',
        headers: apiHeader()
      });
      const data1 = await fetch1.json();
      if(!fetch1.ok || fetch1.status !== 200){
        dispatch({ type: APP_SETTINGS, payload: {} });
        reject(false); return false;
      }else{
        let res = {};
        data1.data.result.forEach(d => {
          res[d.name] = d.value;
        });
        dispatch({ type: APP_SETTINGS, payload: res });
        resolve(true); return true;
      }
    } catch (err) {
      console.log(err);
      reject(err); return false;
    }
  });
};
