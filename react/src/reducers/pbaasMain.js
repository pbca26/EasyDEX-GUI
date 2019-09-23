import {
  CHANGE_PBAAS_ACTIVE_SECTION,
  UPDATE_PBAAS_FORM_STATE,
  PBAAS_ACTIVE_CHAININFO_MODAL,
  UPDATE_DEFINED_CHAINS,
  DASHBOARD_REMOVE_COIN,
  DASHBOARD_ACTIVE_COIN_CHANGE,
  SYNCING_NATIVE_MODE,
  DASHBOARD_UPDATE
} from '../actions/storeType';
import { CONNECT } from '../util/constants'
import { PBAAS_ROOT_CHAIN } from '../util/pbaas/pbaasConstants'

export const PBaaSMain = (state = {
  activeSectionPbaas: CONNECT,
  formState: {
    currentStep: -1
  },
  definedChains: [],
  showChainInfo: false,
  showChainInfoChainIndex: null,
  rootChainActive: false,
  rootChainHeight: 0
}, action) => {
  switch (action.type) {
    case CHANGE_PBAAS_ACTIVE_SECTION:
      return {
        ...state,
        activeSectionPbaas: action.activeSectionPbaas,
      };
    case UPDATE_PBAAS_FORM_STATE:
      return {
        ...state,
        formState: action.formState,
      };
    case UPDATE_DEFINED_CHAINS:
      return {
        ...state,
        definedChains: action.definedChains,
      };
    case PBAAS_ACTIVE_CHAININFO_MODAL:
      return {
        ...state,
        showChainInfo: action.showChainInfo,
        showChainInfoChainIndex: action.showChainInfoChainIndex,
      };
    case DASHBOARD_REMOVE_COIN:
      return{
        ...state,
        rootChainActive: action.coin === PBAAS_ROOT_CHAIN ? false : state.rootChainActive,
      };
    case DASHBOARD_ACTIVE_COIN_CHANGE:
      return{
        ...state,
        rootChainActive: action.coin === PBAAS_ROOT_CHAIN ? true : state.rootChainActive,
      };
    case DASHBOARD_UPDATE:
      if (action.coin === PBAAS_ROOT_CHAIN) {
        return{
          ...state,
          rootChainActive: true,
          rootChainHeight: action.progress && action.progress.longestchain ? action.progress.longestchain : 0
        };
      } else {
        return {...state}
      }
    default:
      return state;
  }
}

export default PBaaSMain;