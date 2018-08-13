import { 
  triggerToaster,
  getPrivateTxList,
  getTransaction
 } from '../actionCreators';
import Config from '../../config';
import { DASHBOARD_UPDATE } from '../storeType';
import fetchType from '../../util/fetchType';
import { resolve } from 'path';

export const getDashboardUpdate = (coin, activeCoinProps) => {
  return dispatch => {
    const _fetchConfig = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        coin: coin,
        rpc2cli: Config.rpc2cli,
        token: Config.token,
      }),
    };

    return fetch(
      `http://127.0.0.1:${Config.agamaPort}/shepherd/native/dashboard/update`,
      fetchType(
        JSON.stringify({
          coin: coin,
          rpc2cli: Config.rpc2cli,
          token: Config.token,
        })
      ).post
    )
    .catch((error) => {
      console.log(error);
      dispatch(
        triggerToaster(
          'getDashboardUpdate',
          'Error',
          'error'
        )
      );
    })
    .then(response => response.json())
    .then(json => {
      let resultObj = {mainJson: json, privateTxList: [], txInfoList: null};

      const _addresses = resultObj.mainJson.result.addresses;
      let privateAddrs = [];
      for (let i = 0; i < _addresses.private.length; i++) {
        privateAddrs.push(_addresses.private[i].address);
      }

      let promiseArray = [];
      for (let i = 0; i < privateAddrs.length; i++) {
        let getPrivateTxListPromise = getPrivateTxList(coin, privateAddrs[i]);
        promiseArray.push(getPrivateTxListPromise);
      }

      promiseArray.push(resultObj);
      return Promise.all(promiseArray);
    })
    .catch((error) => {
      console.log(error);
    })
    .then(returnList => {
      let promiseArray = [];
      let resultObj = returnList.pop();
      let _privateTxList = returnList[0] ? returnList[0] : [];

      let privateTxData = [resultObj];

      if (_privateTxList.length > 0) {
        _privateTxList.sort((a, b) => {
          return (a.txid < b.txid) ? -1 : (a.txid > b.txid) ? 1 : 0;
        });
      }

      resultObj.privateTxList = _privateTxList;

      return getTransactionGroups(coin, _privateTxList, privateTxData);
    })
    .then(returnList => {
      let resultObj = returnList.shift();

      for (let i = 0; i < returnList.length; i++) {
        let tx = returnList[i];
        let pvtx = resultObj.privateTxList[i];
        tx.amount = pvtx.amount;
        tx.memo = pvtx.memo;
        tx.address = pvtx.address;
        tx.category = 'receive';
      }

      let json = resultObj.mainJson;

      // dirty hack to trigger dashboard render
      if (!activeCoinProps ||
          (activeCoinProps && !activeCoinProps.balance && !activeCoinProps.addresses)) {
        setTimeout(() => {
          dispatch(getDashboardUpdateState(json, coin, returnList, false));
        }, 100);
      }
      dispatch(getDashboardUpdateState(json, coin, returnList, false));
    });
  }
}

export const getTransactionGroups = (coin, array, results) => {
  let txInputGroups = [{ coin: coin, group: array.slice(0, 100)}];
  let numCounted = txInputGroups[0].group.length;

  while (numCounted < array.length) {
    txInputGroups.push({coin: coin, group: array.slice(numCounted, numCounted + 100)});
    numCounted += txInputGroups[txInputGroups.length - 1].group.length;
  }

  return txInputGroups.reduce((p, a) => {
    return p.then(chainResults => {
      return getTransactions(a.coin, a.group).then( txGroup => {
        return chainResults.concat(txGroup);
      })
    })},
    Promise.resolve(results)
  )
}

export const getTransactions = (coin, array) => {
  let promiseArray = [];
  for (let i = 0; i < array.length; i++)
  {
    promiseArray.push(getTransaction(coin, array[i].txid));
  }
  return Promise.all(promiseArray);
}

export const getDashboardUpdateState = (json, coin, privateTransactions, fakeResponse) => {
  // rescan or similar resource heavy process
  if (fakeResponse ||
      ((json.result.getinfo.error && json.result.getinfo.error === 'daemon is busy') &&
      (json.result.z_getoperationstatus.error && json.result.z_getoperationstatus.error === 'daemon is busy') &&
      (json.result.listtransactions.error && json.result.listtransactions.error === 'daemon is busy') &&
      (json.result.listtransactions.error && json.result.listtransactions.error === 'daemon is busy'))) {
    return {
      type: DASHBOARD_UPDATE,
      progress: null,
      opids: null,
      txhistory: null,
      balance: null,
      addresses: null,
      coin: coin,
      getinfoFetchFailures: 0,
      rescanInProgress: true,
    };
  } else {
    let _listtransactions = json.result.listtransactions;

    if (_listtransactions &&
        _listtransactions.error) {
      _listtransactions = null;
    } else if (
      _listtransactions &&
      _listtransactions.result &&
      _listtransactions.result.length
    ) {
      _listtransactions = _listtransactions.result;
    } else if (
      !_listtransactions ||
      (!_listtransactions.result || !_listtransactions.result.length)
    ) {
      _listtransactions = 'no data';
    }

    if (coin === 'CHIPS') {
      return {
        type: DASHBOARD_UPDATE,
        progress: json.result.getinfo.result,
        opids: null,
        txhistory: _listtransactions,
        balance: {
          transparent: json.result.getbalance.result,
          total: json.result.getbalance.result,
        },
        addresses: json.result.addresses,
        coin: coin,
        getinfoFetchFailures: 0,
        rescanInProgress: false,
      };
    } else {
      let allTransactions = _listtransactions.concat(privateTransactions);

      // calc transparent balance properly
      const _addresses = json.result.addresses;
      let _tbalance = 0;

      if (_addresses &&
          _addresses.public &&
          _addresses.public.length) {
        for (let i = 0; i < _addresses.public.length; i++) {
          _tbalance += _addresses.public[i].spendable;
        }
      }

      json.result.z_gettotalbalance.result.transparent = _tbalance.toFixed(8);
      json.result.z_gettotalbalance.result.total = Number(json.result.z_gettotalbalance.result.transparent) + Number(json.result.z_gettotalbalance.result.interest) + Number(json.result.z_gettotalbalance.result.private);
      json.result.z_gettotalbalance.result.total = json.result.z_gettotalbalance.result.total.toFixed(8);

      return {
        type: DASHBOARD_UPDATE,
        progress: json.result.getinfo.result,
        opids: json.result.z_getoperationstatus.result,
        txhistory: allTransactions,
        balance: json.result.z_gettotalbalance.result,
        addresses: json.result.addresses,
        coin: coin,
        getinfoFetchFailures: 0,
        rescanInProgress: false,
      };
    }
  }
}