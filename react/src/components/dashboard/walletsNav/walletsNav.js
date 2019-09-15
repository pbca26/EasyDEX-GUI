import React from 'react';
import { connect } from 'react-redux';
import {
  copyCoinAddress,
  toggleDashboardActiveSection,
  getNativeNettotals,
  getNativePeers,
} from '../../../actions/actionCreators';
import Store from '../../../store';
import Config from '../../../config';
import WalletsNavWithWalletRender from './walletsNav.render';

const NET_INFO_INTERVAL = 10000;

class WalletsNav extends React.Component {
  constructor() {
    super();
    this.toggleNativeWalletInfo = this.toggleNativeWalletInfo.bind(this);
    this.checkTotalBalance = this.checkTotalBalance.bind(this);
    this.netInfoInterval = null;
    this.DEFAULT = 'default'
    this.SEND = 'send',
    this.RECEIVE = 'receive'
    this.SETTINGS = 'settings'
    this.CONVERT = 'convert'
  }

  copyMyAddress(address) {
    Store.dispatch(copyCoinAddress(address));
  }

  checkTotalBalance() {
    const _mode = this.props.ActiveCoin.mode;
    let _balance = '0';

    if (this.props.ActiveCoin.balance &&
        this.props.ActiveCoin.balance.total &&
        _mode === 'native') {
      _balance = this.props.ActiveCoin.balance.total;
    } else if (
      (_mode === 'spv' || _mode === 'eth') &&
      this.props.ActiveCoin.balance.balance
    ) {
      _balance = this.props.ActiveCoin.balance.balance;
    }

    return _balance;
  }

  componentWillReceiveProps(props) {
    if (this.netInfoInterval &&
        props.ActiveCoin.activeSection !== 'settings') {
      clearInterval(this.netInfoInterval);
      this.netInfoInterval = null;
    }
  }

  toggleNativeWalletInfo() {
    if (this.props.ActiveCoin.activeSection !== 'settings' &&
        this.props.ActiveCoin.mode === 'native') {
      Store.dispatch(getNativePeers(this.props.ActiveCoin.coin));
      Store.dispatch(getNativeNettotals(this.props.ActiveCoin.coin));

      this.netInfoInterval = setInterval(() => {
        Store.dispatch(getNativePeers(this.props.ActiveCoin.coin));
        Store.dispatch(getNativeNettotals(this.props.ActiveCoin.coin));
      }, NET_INFO_INTERVAL);
    }

    Store.dispatch(toggleDashboardActiveSection('settings'));
  }

  toggleCoinForm(coinForm) {
    Store.dispatch(
      toggleDashboardActiveSection(
        this.props.ActiveCoin.activeSection === coinForm ? this.DEFAULT : coinForm
      )
    );
  } 

  render() {
    if (this.props &&
        this.props.ActiveCoin &&
        !this.props.ActiveCoin.coin) {
      return null;
    }

    return WalletsNavWithWalletRender.call(this);
  }
}

const mapStateToProps = (state) => {
  return {
    ActiveCoin: {
      coin: state.ActiveCoin.coin,
      mode: state.ActiveCoin.mode,
      send: state.ActiveCoin.send,
      receive: state.ActiveCoin.receive,
      balance: state.ActiveCoin.balance,
      activeSection: state.ActiveCoin.activeSection,
      activeAddress: state.ActiveCoin.activeAddress,
    },
    Dashboard: state.Dashboard,
  };
};

export default connect(mapStateToProps)(WalletsNav);