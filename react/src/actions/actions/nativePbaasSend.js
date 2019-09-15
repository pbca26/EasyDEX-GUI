import {
  triggerToaster,
} from '../actionCreators';
import translate from '../../translate/translate';
import Config, {
  token,
  agamaPort,
  rpc2cli,
} from '../../config';
import fetchType from '../../util/fetchType';
import Store from '../../store';

const PBAAS_ROOT_CHAIN = Config.verus.pbaasTestmode ? 'VRSCTEST' : 'VRSC'

/**
 * This sends a Verus output as a JSON object or lists of Verus outputs as a list of objects to an address on the same or another chain.
 * 
 * @param {String} toChain (Optional) Name of chain to send to. Defaults to current chain.
 * @param {String} toAddr (Required) Destination address
 * @param {String} refundAddr (Optional) If a chain fails to launch, this address will be able to spend
 * it's preconverted funds to that chain
 * @param {Integer} amount (Required) Amount to send
 * @param {Boolean} toNative (optional) Auto-convert from Verus to PBaaS currency at market price
 * @param {Boolean} toReserve (optional) Auto-convert from PBaaS to Verus reserve currency at market price
 * @param {Boolean} preConvert (optional) Auto-convert to PBaaS currency at market price, 
 * this only works if the order is mined before block start of the chain
 * @param {Boolean} subtractFee (optional) If true, reduce amount to destination by the transfer and conversion fee amount. 
 * Normal network fees are never subtracted.
 */
export const sendReserve = (
  toChain,
  toAddr,
  refundAddr,
  amount,
  toNative,
  toReserve,
  preConvert,
  subtractFee
) => {
  return new Promise((resolve, reject) => {
    const payload = {
      mode: null,
      chain: PBAAS_ROOT_CHAIN,
      cmd: 'sendreserve',
      rpc2cli,
      token,
      params: [
        toChain,
        toAddr,
        refundAddr,
        amount,
        toNative,
        toReserve,
        preConvert,
        subtractFee
      ],
    };

    fetch(
      `http://127.0.0.1:${agamaPort}/api/cli`,
      fetchType(JSON.stringify({ payload })).post
    )
    .catch((error) => {
      console.log(error);
      Store.dispatch(
        triggerToaster(
          translate('API.getChainDefinition') + chain + ' (code: getChainDefinition)',
          translate('TOASTR.ERROR'),
          'error'
        )
      );
    })
    .then(response => response.json())
    .then(json => {
      resolve(json);
    });
  });
}
