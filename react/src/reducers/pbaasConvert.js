import {
  CHANGE_PBAAS_CONVERT_ACTIVE_SECTION,
  UPDATE_PBAAS_QUICK_CONVERT_FORM_STATE,
  UPDATE_PBAAS_CC_FORM_STATE,
} from '../actions/storeType';
import { QUICK_CONVERT } from '../util/constants'

export const PBaaSConvert = (state = {
  activeSection: QUICK_CONVERT,
  conversionControlFormState: {
    currentStep: -1
  },
  quickFormState: {
    currentStep: -1
  },
}, action) => {
  switch (action.type) {
    case CHANGE_PBAAS_CONVERT_ACTIVE_SECTION:
      return {
        ...state,
        activeSection: action.activeSection,
      };
    case UPDATE_PBAAS_QUICK_CONVERT_FORM_STATE:
      return {
        ...state,
        quickFormState: action.quickFormState,
      };
    case UPDATE_PBAAS_CC_FORM_STATE:
      return {
        ...state,
        conversionControlFormState: action.conversionControlFormState,
      };
    default:
      return state;
  }
}

export default PBaaSConvert;