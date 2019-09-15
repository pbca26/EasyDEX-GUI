import {
  triggerToaster,
  apiCliPromise
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
  paymentaddress, 
  premine, 
  initialcontribution,
  conversion,
  minpreconvert,
  maxpreconvert,
  launchFee, 
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
        paymentaddress: paymentaddress,
        premine: premine,
        initialcontribution: initialcontribution,
        conversion: conversion,
        minpreconvert: minpreconvert,
        maxpreconvert: maxpreconvert,
        launchFee: launchFee,
        startblock: startblock,
        eras: eras,
        notarizationreward: notarizationreward,
        billingperiod: billingperiod,
        nodes: nodes
      }],
    };

    console.log(payload)

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

export const defineAndCreateChain = (_params) => {
  return new Promise((resolve, reject) => {
    defineChain(
      _params.name, 
      _params.paymentaddress, 
      _params.premine, 
      _params.initialcontribution,
      _params.conversion,
      _params.minpreconvert,
      _params.maxpreconvert,
      _params.launchFee, 
      _params.startblock,
      _params.eras,
      _params.notarizationreward,
      _params.billingperiod,
      _params.nodes
    )
    .then((res) => {
      if (res.error || !res.result) {
        return res
      } else {
        return (apiCliPromise(
          null,
          PBAAS_ROOT_CHAIN,
          'sendrawtransaction',
          [res.result.hex]
        ))
      }
    })
    .then(res => {
      if (res && res.result && !res.error) {
        resolve(res.result)
      } else {
        resolve(res)
      }
    })
  });
}

export const getDefinedChains = () => {
  return new Promise((resolve, reject) => {
    const payload = {
      mode: null,
      chain: PBAAS_ROOT_CHAIN,
      cmd: 'getdefinedchains',
      rpc2cli,
      token,
      params: [],
    };

    fetch(
      `http://127.0.0.1:${agamaPort}/api/cli`,
      fetchType(JSON.stringify({ payload })).post
    )
    .catch((error) => {
      console.log(error);
      Store.dispatch(
        triggerToaster(
          translate('API.getDefinedChains') + chain + ' (code: getDefinedChains)',
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