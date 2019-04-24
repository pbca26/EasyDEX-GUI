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

const PBAAS_ROOT_CHAIN = 'VRSCTEST'

export const getChainDefinition = (chain) => {
  return new Promise((resolve, reject) => {
    const payload = {
      mode: null,
      chain: PBAAS_ROOT_CHAIN,
      cmd: 'getchaindefinition',
      rpc2cli,
      token,
      params: [
        chain
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

export const defineChain = (
  name, 
  address, 
  premine, 
  convertible, 
  launchfee, 
  startblock,
  eras,
  notarizationreward,
  billingperiod,
  nodes) => {
  return new Promise((resolve, reject) => {
    const payload = {
      mode: null,
      chain: PBAAS_ROOT_CHAIN,
      cmd: 'definechain',
      rpc2cli,
      token,
      params: [{
        name: name,
        address: address,
        premine: premine,
        convertible: convertible,
        launchfee: launchfee,
        startblock: startblock,
        eras: eras,
        notarizationreward: notarizationreward,
        billingperiod: billingperiod,
        nodes: nodes
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
          translate('API.defineChain') + name + ' (code: defineChain)',
          translate('TOASTR.ERROR'),
          'error'
        )
      );
    })
    .then(response => response.json())
    .then(json => {
      console.log(json)
      resolve(json);
    });
  });
}