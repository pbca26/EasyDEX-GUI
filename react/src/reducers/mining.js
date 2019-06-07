import {
  UPDATE_MINING_INFO,
  TOGGLE_MINING_OPTIONS
} from '../actions/storeType';

//MiningInfo and mining open have info in them 
//for each coin
export const Mining = (state = {
  miningInfo: {},
  miningOpen: {}
}, action) => {
  switch (action.type) {
    case UPDATE_MINING_INFO:
      let _miningInfo = state.miningInfo
      _miningInfo[action.coin] = action.miningInfo
      return {
        ...state,
        miningInfo: _miningInfo,
      };
    case TOGGLE_MINING_OPTIONS:
      let _miningOpen = state.miningOpen
      _miningOpen[action.coin] = !state.miningOpen[action.coin]
      return {
        ...state,
        miningOpen: _miningOpen,
      };
    default:
      return state;
  }
}

export default Mining;