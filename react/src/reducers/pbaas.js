import {
  CHANGE_PBAAS_ACTIVE_SECTION,
  UPDATE_PBAAS_FORM_STATE
} from '../actions/storeType';

export const PBaaS = (state = {
  activeSectionPbaas: 'connect',
  formState: {
    currentStep: -1
  }
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
    default:
      return state;
  }
}

export default PBaaS;