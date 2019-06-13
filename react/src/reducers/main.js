import {
  GET_ACTIVE_COINS,
  LOGIN,
  ACTIVE_HANDLE,
  DISPLAY_LOGIN_SETTINGS_MODAL,
  DISPLAY_NOTARY_ELECTIONS_MODAL,
  BLUR_SENSITIVE_DATA,
  NEW_UPDATE_AVAILABLE,
  DASHBOARD_USER_AGREEMENT_MODAL,
} from '../actions/storeType';

export const Main = (state = {
  isLoggedIn: false,
  isPin: false,
  walletType: null,
  multisig: null,
  displayLoginSettingsModal: false,
  displayNotaryElectionsModal: false,
  displayUserAgreementModal: false,
  blurSensitiveData: false,
  newUpdateAvailable: false,
  total: 0,
  nativeStartParams: {},
}, action) => {
  switch (action.type) {
    case GET_ACTIVE_COINS:
      return {
        ...state,
        coins: action.coins,
        total: action.total,
        nativeStartParams: action.params,
      };
    case LOGIN:
      return {
        ...state,
        isLoggedIn: action.isLoggedIn,
        isPin: action.isPin,
      };
    case ACTIVE_HANDLE:
      return {
        ...state,
        isLoggedIn: action.isLoggedIn,
        isPin: action.isPin,
        activeHandle: action.handle,
        walletType: action.walletType,
        multisig: action.multisig,
      };
    case DISPLAY_LOGIN_SETTINGS_MODAL:
      return {
        ...state,
        displayLoginSettingsModal: action.displayLoginSettingsModal,
      };
    case DISPLAY_NOTARY_ELECTIONS_MODAL:
      return {
        ...state,
        displayNotaryElectionsModal: action.displayNotaryElectionsModal,
      };
    case BLUR_SENSITIVE_DATA:
      return {
        ...state,
        blurSensitiveData: action.blurSensitiveData,
      };
    case NEW_UPDATE_AVAILABLE:
      return {
        ...state,
        newUpdateAvailable: action.newUpdateAvailable,
      };
    case DASHBOARD_USER_AGREEMENT_MODAL:
      return {
        ...state,
        displayUserAgreementModal: action.display,
      };
    default:
      return state;
  }
}

export default Main;