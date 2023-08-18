import { alertLoading, alertChange } from './alert.actions';
import { apiHeader } from '../helpers/header';
import { API_URL } from './variables';
import {
  APP_USERS,
  ASSET_CATEGORIES,
} from './types';
import {
  PaginateModel, UserModel,
  AssetCategoryModel,
} from '../models';


export const processClear = (type) => (dispatch) => {
  if(type === 'users') dispatch({ type: APP_USERS, payload: [] });
  else if(type === 'asset-categories') dispatch({ type: ASSET_CATEGORIES, payload: [] });
};


export const processList = (type, input={}, loading=false) => async (dispatch) => {
  return new Promise(async (resolve, reject) => {
    let isExport = type.includes('export-');
    if(loading) dispatch(alertLoading(true));
    try {
      const fetch1 = await fetch(`${API_URL}admin/${type}`, {
        method: 'POST',
        headers: apiHeader(),
        body: JSON.stringify(input)
      });
      const data1 = await fetch1.json();
      if(!fetch1.ok || fetch1.status !== 200){
        if(loading) dispatch(alertLoading(false));
        reject(data1); return false;
      }

      let res = {
        paginate: new PaginateModel(data1.data.paginate? data1.data.paginate: {}),
        dataFilter: data1.data.dataFilter? data1.data.dataFilter: {},
        result: []
      };
      if(type === 'users'){
        res.result = data1.data.result.map(d => new UserModel(d));
        dispatch({ type: APP_USERS, payload: res.result });
      }else if(type === 'asset-categories'){
        res.result = data1.data.result.map(d => new AssetCategoryModel(d));
        dispatch({ type: ASSET_CATEGORIES, payload: res.result });
      }else if(isExport){
        if(data1.data.fileName){
          res.result = `${API_URL}frontend/download/${data1.data.fileName}`;
          window.open(res.result);
        }
      }else{
        res.result = data1.data.result;
      }

      if(loading) dispatch(alertLoading(false));
      resolve(res); return true;
    } catch (err) {
      console.log(err);
      if(loading) dispatch(alertLoading(false));
      reject(err); return false;
    }
  });
};
export const processRead = (type, input={}, loading=false) => async (dispatch) => {
  return new Promise(async (resolve, reject) => {
    if(loading) dispatch(alertLoading(true));
    let url = `${API_URL}admin/${type}`;
    let sep = '?';
    Object.keys(input).forEach(k => {
      if (input[k] || input[k]===0){ url += `${sep}${k}=${input[k]}`; sep = '&'; }
    });
    try {
      const fetch1 = await fetch(url, {
        method: 'GET',
        headers: apiHeader()
      });
      const data1 = await fetch1.json();
      if(!fetch1.ok || fetch1.status !== 200){
        if(loading) dispatch(alertLoading(false));
        reject(data1); return false;
      }
      
      let result = null;
      if(type === 'user'){
        result = new UserModel(data1.data.result);
      }else if(type === 'asset-category'){
        result = new AssetCategoryModel(data1.data.result);
      }else{
        result = data1.data.result;
      }

      if(loading) dispatch(alertLoading(false));
      resolve(result); return true;
    } catch (err) {
      console.log(err);
      if(loading) dispatch(alertLoading(false));
      reject(err); return false;
    }
  });
};
export const processCreate = (type, input={}, loading=false) => async (dispatch) => {
  return new Promise(async (resolve, reject) => {
    if(loading) dispatch(alertLoading(true));
    try {
      const fetch1 = await fetch(`${API_URL}admin/${type}`, {
        method: 'POST',
        headers: apiHeader(),
        body: JSON.stringify(input)
      });
      const data1 = await fetch1.json();
      if(!fetch1.ok || fetch1.status !== 200){
        if(loading) dispatch(alertChange('Warning', data1.message, data1.error? data1.error: []));
        reject(data1); return false;
      }
      
      if(loading) dispatch(alertChange('Info', data1.message));
      resolve(data1); return true;
    } catch (err) {
      console.log(err);
      if(loading) dispatch(alertChange('Danger', 'Internal server error.'));
      reject(err); return false;
    }
  });
};
export const processUpdate = (type, input={}, loading=false) => async (dispatch) => {
  return new Promise(async (resolve, reject) => {
    if(loading) dispatch(alertLoading(true));
    try {
      const fetch1 = await fetch(`${API_URL}admin/${type}`, {
        method: 'PATCH',
        headers: apiHeader(),
        body: JSON.stringify(input)
      });
      const data1 = await fetch1.json();
      if(!fetch1.ok || fetch1.status !== 200){
        if(loading) dispatch(alertChange('Warning', data1.message, data1.error? data1.error: []));
        reject(data1); return false;
      }
      
      if(loading) dispatch(alertChange('Info', data1.message));
      resolve(data1); return true;
    } catch (err) {
      console.log(err);
      if(loading) dispatch(alertChange('Danger', 'Internal server error.'));
      reject(err); return false;
    }
  });
};
export const processDelete = (type, input={}, loading=false) => async (dispatch) => {
  return new Promise(async (resolve, reject) => {
    if(loading) dispatch(alertLoading(true));
    try {
      const fetch1 = await fetch(`${API_URL}admin/${type}`, {
        method: 'DELETE',
        headers: apiHeader(),
        body: JSON.stringify(input)
      });
      const data1 = await fetch1.json();
      if(!fetch1.ok || fetch1.status !== 200){
        if(loading) dispatch(alertChange('Warning', data1.message, data1.error? data1.error: []));
        reject(data1); return false;
      }
      
      if(loading) dispatch(alertChange('Info', data1.message));
      resolve(data1); return true;
    } catch (err) {
      console.log(err);
      if(loading) dispatch(alertChange('Danger', 'Internal server error.'));
      reject(err); return false;
    }
  });
};
