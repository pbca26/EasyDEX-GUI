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
      let resultObj = {mainJson: json, privateTxLists: null, privateAddrList: null, txInfoList: null};
      return resultObj;
    })
    .then(resultObj => {
      const _addresses = resultObj.mainJson.result.addresses;
      let privateAddrs = [];
      for (let i = 0; i < _addresses.private.length; i++) {
        privateAddrs.push(_addresses.private[i].address);
      }
      resultObj.privateAddrList = privateAddrs;
      return resultObj;
    })
    .then(resultObj => {
      let promiseArray = [];
      for (let i = 0; i < resultObj.privateAddrList.length; i++) {
        let getPrivateTxListPromise = getPrivateTxList(coin, resultObj.privateAddrList[i]);
        promiseArray.push(getPrivateTxListPromise);
      }
      promiseArray.push(resultObj);
      return Promise.all(promiseArray);
    })
    .then(returnList => {
      let _privateTxLists = [];
      let resultObj = returnList.pop();

      for (let i = 0; i < returnList.length; i++) {
        _privateTxLists.push(returnList[i]);
      }

      resultObj.privateTxLists = _privateTxLists;
      return resultObj;
    })
    .then(resultObj => {
      let promiseArray = [];

      for (let n = 0; n < resultObj.privateTxLists.length; n++) {
        for(let i = 0; i < resultObj.privateTxLists[n].txList.result.length; i++) {
          let getTransactionInfo = getTransaction(coin, resultObj.privateTxLists[n].txList.result[i].txid);
          promiseArray.push(getTransactionInfo);
        }
      }

      promiseArray.push(resultObj);
      return Promise.all(promiseArray);
    })
    .then(returnList => {
      let _txInfoList = [];
      let resultObj = returnList.pop();

      for (let i = 0; i < returnList.length; i++) {
        _txInfoList.push(returnList[i]);
      }

      resultObj.txInfoList = _txInfoList;
      return resultObj;
    })
    .then(resultObj => {
      let json = resultObj.mainJson;
      // dirty hack to trigger dashboard render
      if (!activeCoinProps ||
          (activeCoinProps && !activeCoinProps.balance && !activeCoinProps.addresses)) {
        setTimeout(() => {
          dispatch(getDashboardUpdateState(json, coin, resultObj.privateTxLists, resultObj.txInfoList, false));
        }, 100);
      }
      else {
        dispatch(getDashboardUpdateState(json, coin, resultObj.privateTxLists, resultObj.txInfoList, false));
      }
    });
  }
}

export const getDashboardUpdateState = (json, coin, privateTxLists, txInfoList, fakeResponse) => {
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

    let allTransactions = _listtransactions
    console.log('pooop');
    console.log(txInfoList);

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
      console.log(privateTxLists);
      for (let n = 0; n < privateTxLists.length; n++) {
        let address = privateTxLists[n].address;
        for (let i = 0; i < privateTxLists[n].txList.result.length; i++) {
          let blockhash, blockindex, blocktime, confirmations, expiryheight, fee, 
              time, timereceived, vjoinsplit, walletconflicts = null;
          let txid = privateTxLists[n].txList.result[i].txid;
            for (let i = 0; i < txInfoList.length; i++) {
              if (txInfoList[i].txid === txid) {
                blockhash = txInfoList[i].blockhash;
                blockindex = txInfoList[i].blockindex;
                blocktime = txInfoList[i].blocktime;
                confirmations = txInfoList[i].confirmations;
                expiryheight = txInfoList[i].expiryheight;
                fee = txInfoList[i].fee;
                time = txInfoList[i].time;
                timereceived = txInfoList[i].timereceived;
                vjoinsplit = txInfoList[i].vjoinsplit;
                walletconflicts = txInfoList[i].walletconflicts;
              }
            }
          let amount = privateTxLists[n].txList.result[i].amount;
          let memo = privateTxLists[n].txList.result[i].memo;
          let privateTx = {account: "", 
                          address: address, 
                          amount: amount, 
                          blockhash: blockhash, 
                          blockindex: blockindex, 
                          blocktime: blocktime, 
                          category: 'receive', 
                          confirmations: confirmations, 
                          expiryheight: expiryheight, 
                          fee: fee,
                          size: null, 
                          time: time,
                          timereceived: timereceived, 
                          txid: txid, 
                          vjoinsplit: vjoinsplit, 
                          vout: null, 
                          walletconflicts: walletconflicts, 
                          memo: memo};
          allTransactions.push(privateTx);
        }
      }
      console.log(allTransactions);

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