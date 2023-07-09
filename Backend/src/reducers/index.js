import { combineReducers } from 'redux';
import alertReducer from './alert.reducer';
import appReducer from './app.reducer';
import userReducer from './user.reducer';

export default combineReducers({
  alert: alertReducer,
  app: appReducer,
  user: userReducer,
});
