import {
  CLIENT_IP, SIDENAV_ACTIVE_INDEX,
  APP_SETTINGS, APP_USERS
} from '../actions/types';

const initialState = {
  clientIp: null,
  sidenavActiveIndex: 0,
  settings: {},
  users: [],
};

const appReducer = (state = initialState, action) => {
  switch(action.type) {

    case CLIENT_IP:
      return {...state, clientIp: action.payload };
    case SIDENAV_ACTIVE_INDEX:
      return {...state, sidenavActiveIndex: action.payload };

    case APP_SETTINGS:
      return {...state, settings: action.payload };
      
    case APP_USERS:
      return {...state, users: action.payload };

    default:
      return state;
  }
};

export default appReducer;