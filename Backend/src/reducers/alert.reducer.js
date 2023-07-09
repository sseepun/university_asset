import { AlertModel } from '../models';
import { ALERT_CHANGE, ALERT_DISAPPEAR, ALERT_LOADING } from '../actions/types';

const initialState = new AlertModel({});

const alertReducer = (state = initialState, action) => {
  switch(action.type) {

    case ALERT_CHANGE:
      return {...state, ...action.payload};

    case ALERT_DISAPPEAR:
      return {...state, status: false};

    case ALERT_LOADING:
      return {...state, loading: action.payload};
      
    default:
      return state;
  }
};

export default alertReducer;