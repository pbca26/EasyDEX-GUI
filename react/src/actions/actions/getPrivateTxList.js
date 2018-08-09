import { triggerToaster } from '../actionCreators';
import Config from '../../config';
import Store from '../../store';
import fetchType from '../../util/fetchType';

export const getPrivateTxList = (coin, addr) => {
  return new Promise((resolve, reject) => {
    let payload = {
      mode: null,
      chain: coin,
      cmd: 'z_listreceivedbyaddress',
      params: [
        addr
      ],
      rpc2cli: Config.rpc2cli,
      token: Config.token,
    };

    fetch(
      `http://127.0.0.1:${Config.agamaPort}/shepherd/cli`,
      fetchType(JSON.stringify({ payload })).post
    )
    .catch((error) => {
      console.log(error);
      Store.dispatch(
        triggerToaster(
          'z_listreceivedbyaddress',
          'Error',
          'error'
        )
      );
    })
    .then(response => response.json())
    .then(json => {
      var txListObj = {address: addr, txList: json};
      resolve(txListObj);
    });
  });
}