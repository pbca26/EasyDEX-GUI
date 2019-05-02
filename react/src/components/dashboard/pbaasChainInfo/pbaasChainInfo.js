import React from 'react';
import { connect } from 'react-redux';
import translate from '../../../translate/translate';
import {
  togglePbaasChainInfoModal,
  triggerToaster,
  addCoin,
  dashboardChangeSectionState,
  toggleDashboardActiveSection
} from '../../../actions/actionCreators';
import Store from '../../../store';
import ChainInfoRender from './pbaasChainInfo.render';

const NATIVE_MODE = -1;
const VERUS_DAEMON = 'verusd';

class PbaasChainInfo extends React.Component {
  constructor() {
    super();
    this.state = {
      activeTab: 0,
      chainInfo: {
        name: '',
        startblock: '',
        premine: '',
        notarizationreward: '',
        eras: [],
        conversion: '',
        conversionpercent: '',
        version: ''
      },
      className: 'hide',
    };
    this.toggleChainInfoModal = this.toggleChainInfoModal.bind(this);
  }

  toggleChainInfoModal() {
    this.setState(Object.assign({}, this.state, {
      className: 'show out',
    }));

    setTimeout(() => {
      Store.dispatch(togglePbaasChainInfoModal(false));

      this.setState(Object.assign({}, this.state, {
        activeTab: 0,
      }));
    }, 300);
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  componentWillReceiveProps(nextProps) {
    const _PBaaS = nextProps.PBaaS

    if (_PBaaS &&
        _PBaaS.definedChains &&
        _PBaaS.showChainInfoChainIndex > -1 &&
        _PBaaS.showChainInfoChainIndex !== false) {
      const _chainInfo = _PBaaS.definedChains[_PBaaS.showChainInfoChainIndex];

      if (_chainInfo &&
          this.props.PBaaS.showChainInfoChainIndex !== _PBaaS.showChainInfoChainIndex) {
        this.setState({
          className: _PBaaS.showChainInfo ? 'show fade' : 'show out',
          chainInfo: _chainInfo
        });

        setTimeout(() => {
          this.setState(Object.assign({}, this.state, {
            className: _PBaaS.showChainInfo ? 'show in' : 'hide',
          }));
        }, _PBaaS.showChainInfo ? 50 : 300);
      }
    }
  }

  openTab(tab) {
    this.setState(Object.assign({}, this.state, {
      activeTab: tab,
    }));
  }

  handleKeydown(e) {
    if (e.key === 'Escape') {
      this.toggleChainInfoModal();
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

  activatePbaasChain() {
    if (this.isCoinAlreadyAdded(this.state.chainInfo.name)) {
      return;
    }

    let rpcPort;
    //Parse first time rpc port from chain info
    if (this.state.chainInfo.nodes.length && this.state.chainInfo.nodes[0].networkaddress) {
      let splitAddress = this.state.chainInfo.nodes[0].networkaddress.split(':')
      rpcPort = Number(splitAddress[1]) + 1
    }
    
    this.toggleChainInfoModal();
    Store.dispatch(addCoin(
      this.state.chainInfo.name,
      NATIVE_MODE,
      null,
      null,
      null,
      VERUS_DAEMON,
      rpcPort
    ));
    Store.dispatch(dashboardChangeSectionState('wallets'));
    Store.dispatch(toggleDashboardActiveSection('default')); 
  }

  isCoinAlreadyAdded(coin) {
    const modes = [
      'spv',
      'native',
      'eth',
    ];
    const existingCoins = this.props.Main.coins

    for (let mode of modes) {
      if (existingCoins[mode] &&
          existingCoins[mode].indexOf(coin) !== -1) {
        const message = `${coin} ${translate('ADD_COIN.ALREADY_ADDED')}`;

        Store.dispatch(
          triggerToaster(
            message,
            translate('ADD_COIN.COIN_ALREADY_ADDED'),
            'error'
          )
        );

        return true;
      }
    }

    return false;
  }

  render() {
    const _PBaaS = this.props.PBaaS

    if (this.props &&
      _PBaaS &&
      _PBaaS.definedChains &&
      _PBaaS.showChainInfo &&
      _PBaaS.activeSectionPbaas === 'discover' &&
      _PBaaS.showChainInfoChainIndex > -1) {

      const chainInfo = _PBaaS.definedChains[_PBaaS.showChainInfoChainIndex];

      return ChainInfoRender.call(this, chainInfo);
    }

    return null;
  }
}

const mapStateToProps = (state) => {
  return {
    Main: {
      coins: state.Main.coins
    },
    PBaaS: {
      definedChains: state.PBaaS.definedChains,
      showChainInfoChainIndex: state.PBaaS.showChainInfoChainIndex,
      showChainInfo: state.PBaaS.showChainInfo,
      activeSectionPbaas: state.PBaaS.activeSectionPbaas
    }
  };
};

export default connect(mapStateToProps)(PbaasChainInfo);