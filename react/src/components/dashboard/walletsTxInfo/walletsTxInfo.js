import React from 'react';
import { connect } from 'react-redux';
import translate from '../../../translate/translate';
import sortByDate from '../../../util/sort';
import {
  toggleDashboardTxInfoModal,
  getTxDetails,
} from '../../../actions/actionCreators';
import Store from '../../../store';
import WalletsTxInfoRender from './walletsTxInfo.render';
import explorerList from '../../../util/explorerList';
import { DASHBOARD_ELECTRUM_TRANSACTIONS } from '../../../actions/storeType';

const shell = window.require('electron').shell;

class WalletsTxInfo extends React.Component {
  constructor() {
    super();
    this.state = {
      activeTab: 0,
      txDetails: null,
      rawTxDetails: null,
    };
    this.toggleTxInfoModal = this.toggleTxInfoModal.bind(this);
    this.loadTxDetails = this.loadTxDetails.bind(this);
    this.loadRawTxDetails = this.loadRawTxDetails.bind(this);
  }

  toggleTxInfoModal() {
    Store.dispatch(toggleDashboardTxInfoModal(false));

    this.setState(Object.assign({}, this.state, {
      activeTab: 0,
    }));
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.ActiveCoin.mode === 'spv' &&
        nextProps.ActiveCoin) {
      this.setState(Object.assign({}, this.state, {
        txDetails: nextProps.ActiveCoin.showTransactionInfoTxIndex,
        rawTxDetails: nextProps.ActiveCoin.showTransactionInfoTxIndex,
      }));
    } else {
      //TODO: Solve why nextProps.ActiveCoin.showTransactionInfoTxIndex is null if it is passed 0
      //in activeCoin.js
      if (nextProps.ActiveCoin &&
          nextProps.ActiveCoin.txhistory /* && nextProps.ActiveCoin.showTransactionInfoTxIndex */) {
        const txInfo = nextProps.ActiveCoin.txhistory[nextProps.ActiveCoin.showTransactionInfoTxIndex ? nextProps.ActiveCoin.showTransactionInfoTxIndex : 0];

        if (txInfo &&
            this.props.ActiveCoin.showTransactionInfoTxIndex !== nextProps.ActiveCoin.showTransactionInfoTxIndex) {
          this.loadTxDetails(nextProps.ActiveCoin.coin, txInfo.txid);
          this.loadRawTxDetails(nextProps.ActiveCoin.coin, txInfo.txid);
        }
      }
    }
  }

  loadTxDetails(coin, txid) {
    this.setState(Object.assign({}, this.state, {
      txDetails: null,
    }));

    getTxDetails(coin, txid)
    .then((json) => {
      this.setState(Object.assign({}, this.state, {
        txDetails: json,
      }));
    });
  }

  loadRawTxDetails(coin, txid) {
    getTxDetails(coin, txid, 'raw')
    .then((json) => {
      this.setState(Object.assign({}, this.state, {
        rawTxDetails: json,
      }));
    });
  }

  openTab(tab) {
    this.setState(Object.assign({}, this.state, {
      activeTab: tab,
    }));
  }

  handleKeydown(e) {
    if (e.key === 'Escape') {
      this.toggleTxInfoModal();
    }
  }

  openExplorerWindow(txid) {
    const url = explorerList[this.props.ActiveCoin.coin].split('/').length - 1 > 2 ? `${explorerList[this.props.ActiveCoin.coin]}${txid}` : `${explorerList[this.props.ActiveCoin.coin]}/tx/${txid}`;
    return shell.openExternal(url);
  }

  renderTimeToUnlock(blockstomaturity){
    const years = ((blockstomaturity/60)/24)/356;
    const months = (years % 1) * 12;
    const days = (months % 1) * 30.4375;
    const hours = (days % 1) * 24;
    const minutes = (hours % 1) * 60;

    if (years < 1){
      if (months < 1){
        if (days < 1){
          if (hours < 1){
            if (minutes < 1){
              return('0 ' + translate('TX_INFO.MINUTES'));
            }
            else {
                return(Math.floor(minutes) + ' ' + this.checkForPlural('MINUTE', minutes));
            }
          }
          else {
              return(Math.floor(hours) + ' ' + this.checkForPlural('HOUR', hours) + ' ' + 
              Math.floor(minutes) + ' ' + this.checkForPlural('MINUTE', minutes));
          }
        }
        else {
            return(
              Math.floor(days) + ' ' + this.checkForPlural('DAY', days) + ' ' +
              Math.floor(hours) + ' ' + this.checkForPlural('HOUR', hours) + ' ' + 
              Math.floor(minutes) + ' ' + this.checkForPlural('MINUTE', minutes));
        }
      }
      else {
          return(
            Math.floor(months) + ' ' + this.checkForPlural('MONTH', months) + ' ' +
            Math.floor(days) + ' ' + this.checkForPlural('DAY', days) + ' ' +
            Math.floor(hours) + ' ' + this.checkForPlural('HOUR', hours) + ' ' + 
            Math.floor(minutes) + ' ' + this.checkForPlural('MINUTE', minutes));
      }
    }
    else {
        return(
          Math.floor(years) + ' ' + this.checkForPlural('YEAR', years) + ' ' + 
          Math.floor(months) + ' ' + this.checkForPlural('MONTH', months) + ' ' +
          Math.floor(days) + ' ' + this.checkForPlural('DAY', days) + ' ' +
          Math.floor(hours) + ' ' + this.checkForPlural('HOUR', hours) + ' ' + 
          Math.floor(minutes) + ' ' + this.checkForPlural('MINUTE', minutes));
    }
  }

  checkForPlural(term, time) {
    if (time > 1 && time < 2){
      return (translate('TX_INFO.' + term));
    }
    else {
      return (translate('TX_INFO.' + term + 'S'));
    }
  }

  render() {
    if (this.props &&
        this.props.ActiveCoin &&
        this.props.ActiveCoin.showTransactionInfo &&
        this.props.ActiveCoin.activeSection === 'default') {
      //TODO: Solve why this.props.ActiveCoin.showTransactionInfoTxIndex is null if it is passed 0
      //in activeCoin.js
      if (this.props.ActiveCoin.mode === 'native') {
        if (this.props.ActiveCoin.txhistory /* && this.props.ActiveCoin.showTransactionInfoTxIndex */) {
          const txInfo = this.props.ActiveCoin.txhistory[this.props.ActiveCoin.showTransactionInfoTxIndex ? this.props.ActiveCoin.showTransactionInfoTxIndex : 0];

          return WalletsTxInfoRender.call(this, txInfo);
        } else {
          return null;
        }
      } else {
        return WalletsTxInfoRender.call(this);
      }
    }

    return null;
  }
}

const mapStateToProps = (state) => {
  return {
    ActiveCoin: {
      mode: state.ActiveCoin.mode,
      coin: state.ActiveCoin.coin,
      txhistory: state.ActiveCoin.txhistory,
      showTransactionInfo: state.ActiveCoin.showTransactionInfo,
      activeSection: state.ActiveCoin.activeSection,
      activeAddress: state.ActiveCoin.activeAddress,
      showTransactionInfoTxIndex: state.ActiveCoin.showTransactionInfoTxIndex,
    },
  };
};

export default connect(mapStateToProps)(WalletsTxInfo);
