import {
  CHANGE_PBAAS_ACTIVE_SECTION,
  UPDATE_PBAAS_FORM_STATE,
  PBAAS_ACTIVE_CHAININFO_MODAL,
  UPDATE_DEFINED_CHAINS
} from '../actions/storeType';
import { CONNECT } from '../util/constants'

export const PBaaSMain = (state = {
  activeSectionPbaas: CONNECT,
  formState: {
    currentStep: -1
  },
  definedChains: [],
  showChainInfo: false,
  showChainInfoChainIndex: null,
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
    default:
      return state;
  }
}

export default PBaaSMain;