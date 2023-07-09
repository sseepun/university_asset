import { APP_PREFIX } from '../actions/variables';
import {
  USER_SIGNIN, USER_SIGNOUT, USER_UPDATE,
} from '../actions/types';
import { UserModel } from '../models';

var temp;
const user = localStorage.getItem(`${APP_PREFIX}_USER`);
const initialState = {
  user: new UserModel(user? JSON.parse(user): {}),
  accessToken: null,
  refreshToken: null,
};

const userReducer = (state = initialState, action) => {
  switch(action.type) {

    case USER_SIGNIN:
      temp = new UserModel(action.payload.user);
      localStorage.setItem(`${APP_PREFIX}_USER`, JSON.stringify(temp));
      localStorage.setItem(`${APP_PREFIX}_ACCESS`, action.payload.accessToken);
      localStorage.setItem(`${APP_PREFIX}_REFRESH`, action.payload.refreshToken);
      return {
        ...state, user: temp,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken
      };

    case USER_SIGNOUT:
      temp = new UserModel({});
      localStorage.removeItem(`${APP_PREFIX}_USER`);
      localStorage.removeItem(`${APP_PREFIX}_ACCESS`);
      localStorage.removeItem(`${APP_PREFIX}_REFRESH`);
      return {
        ...state,
        user: temp,
        accessToken: null,
        refreshToken: null,
      };

    case USER_UPDATE:
      temp = JSON.parse(localStorage.getItem(`${APP_PREFIX}_USER`));
      if(action.payload.firstname) temp.firstname = action.payload.firstname;
      if(action.payload.lastname) temp.lastname = action.payload.lastname;
      if(action.payload.username) temp.username = action.payload.username;
      if(action.payload.email) temp.email = action.payload.email;
      if(action.payload.telephone) temp.telephone = action.payload.telephone;
      if(action.payload.avatar) temp.avatar = action.payload.avatar;
      if(action.payload.url) temp.url = action.payload.url;
      if(action.payload.description) temp.description = action.payload.description;
      if(action.payload.banner) temp.banner = action.payload.banner;
      if(action.payload.address) temp.address = action.payload.address;

      localStorage.setItem(`${APP_PREFIX}_USER`, JSON.stringify(temp));
      return { ...state, user: temp };

    default:
      return state;
  }
};

export default userReducer;