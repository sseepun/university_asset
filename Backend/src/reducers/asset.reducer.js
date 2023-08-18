import {
  ASSET_CATEGORIES, ASSET_ASSETS,
} from '../actions/types';

const initialState = {
  categories: [],
  assets: [],
};

const assetReducer = (state = initialState, action) => {
  switch(action.type) {

    case ASSET_CATEGORIES:
      return {...state, categories: action.payload };
    case ASSET_ASSETS:
      return {...state, assets: action.payload };

    default:
      return state;
  }
};

export default assetReducer;