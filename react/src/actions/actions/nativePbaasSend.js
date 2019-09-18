import {
  triggerToaster,
  getDashboardUpdate,
  sendToAddressState
} from '../actionCreators';
import translate from '../../translate/translate';
import Config, {
  token,
  agamaPort,
  rpc2cli,
} from '../../config';
import fetchType from '../../util/fetchType';
import Store from '../../store';

/**
 * This sends a Verus output as a JSON object or lists of Verus outputs as a list of objects to an address on the same or another chain.
 * 
 * @param {String} fromChain (Required) Ticker of chain being sent from.
 * @param {String} name (Optional) Ticker of chain to send to. Defaults to current chain.
 * @param {String} paymentaddress (Required) Destination address
 * @param {String} refundaddress (Optional) If a chain fails to launch, this address will be able to spend
 * it's preconverted funds to that chain
 * @param {Integer} amount (Required) Amount to send
 * @param {Boolean} tonative (optional) Auto-convert from Verus to PBaaS currency at market price
 * @param {Boolean} toreserve (optional) Auto-convert from PBaaS to Verus reserve currency at market price
 * @param {Boolean} preconvert (optional) Auto-convert to PBaaS currency at market price, 
 * this only works if the order is mined before block start of the chain
 * @param {Boolean} subtractfee (optional) If true, reduce amount to destination by the transfer and conversion fee amount. 
 * Normal network fees are never subtracted.
 */
export const sendReserve = (
  fromChain,
  name,
  paymentaddress,
  refundaddress,
  amount,
  tonative,
  toreserve,
  preconvert,
  subtractfee
) => {
  return dispatch => {
    const payload = {
      mode: null,
      chain: fromChain,
      cmd: 'sendreserve',
      rpc2cli,
      token,
      params: [{
        name,
        paymentaddress,
        refundaddress,
        amount: Number(amount),
        tonative: tonative ? 1 : 0,
        toreserve: toreserve ? 1 : 0,
        preconvert: preconvert ? 1 : 0,
        subtractfee: subtractfee ? 1 : 0
      }],
    };

    fetch(
      `http://127.0.0.1:${agamaPort}/api/cli`,
      fetchType(JSON.stringify({ payload })).post
    )
    .catch((error) => {
      console.log(error);
      Store.dispatch(
        triggerToaster(
          translate('API.sendReserve') + chain + ' (code: sendReserve)',
          translate('TOASTR.ERROR'),
          'error'
        )
      );
    })
    .then((response) => {
      const _response = response.text().then((text) => { return text; });
      return _response;
    })
    .then((json) => {
      console.log(json)
      if (json.indexOf('"code":') > -1) {
        let _message = json.substring(
          `${json.indexOf('"message":"') + 11}`,
          json.indexOf('"},"id":"jl777"')
        );

        if (json.indexOf('"code":-4') > -1) {
          dispatch(
            triggerToaster(
              translate('API.' + (JSON.parse(json).error.message.indexOf('too large') > -1 ? 'TX_TOO_LARGE' : 'WALLETDAT_MISMATCH')),
              translate('TOASTR.WALLET_NOTIFICATION'),
              'info',
              false
            )
          );
        } else if (json.indexOf('"code":-5') > -1) {
          dispatch(
            triggerToaster(
              translate('TOASTR.INVALID_ADDRESS', fromChain),
              translate('TOASTR.WALLET_NOTIFICATION'),
              'error',
            )
          );
        } else {
          if (rpc2cli) {
            _message = JSON.parse(json).error.message;
          }

          dispatch(
            triggerToaster(
              _message,
              translate('TOASTR.WALLET_NOTIFICATION'),
              'error'
            )
          );
        }
      } else {
        dispatch(sendToAddressState(JSON.parse(json).result));
        dispatch(
          triggerToaster(
            translate('TOASTR.TX_SENT_ALT'),
            translate('TOASTR.WALLET_NOTIFICATION'),
            'success'
          )
        );
        Store.dispatch(getDashboardUpdate(fromChain));
      }
    })
  }
}
