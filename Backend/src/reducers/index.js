import { combineReducers } from 'redux';
import alertReducer from './alert.reducer';
import appReducer from './app.reducer';
import userReducer from './user.reducer';
import assetReducer from './asset.reducer';

export default combineReducers({
  alert: alertReducer,
  app: appReducer,
  user: userReducer,
  asset: assetReducer,
});
