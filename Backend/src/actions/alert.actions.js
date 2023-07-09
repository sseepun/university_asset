import { AlertModel } from '../models';
import { ALERT_CHANGE, ALERT_DISAPPEAR, ALERT_LOADING } from './types';

var timeout;

export const alertChange = (type, message, errors=[]) => (dispatch) => {
  dispatch({
    type: ALERT_CHANGE,
    payload: new AlertModel({ 
      status: true, type: type, message: message, errors: errors
    })
  });
  if(timeout) clearTimeout(timeout);
  timeout = setTimeout(() => {
    dispatch({
      type: ALERT_DISAPPEAR,
      payload: false
    });
  }, 3000);
};

export const alertLoading = (loading) => (dispatch) => {
  dispatch({
    type: ALERT_LOADING,
    payload: loading
  });
};
