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
import {
  NATIVE_MODE,
  VERUS_DAEMON
} from '../../../util/constants'

class PbaasChainInfo extends React.Component {
  constructor() {
    super();
    this.state = {
      activeTab: 0,
      chainInfo: {
        chaindefinition: {
          name: '',
          startblock: '',
          premine: '',
          notarizationreward: '',
          eras: [],
          conversion: '',
          conversionpercent: '',
          version: ''
        },
        confirmedheight: '',
        lastconfirmedheight: ''
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
    const _PBaaS = nextProps.PBaaSMain

    if (_PBaaS &&
        _PBaaS.definedChains &&
        _PBaaS.showChainInfoChainIndex > -1 &&
        _PBaaS.showChainInfo !== false) {
      const _chainInfo = _PBaaS.definedChains[_PBaaS.showChainInfoChainIndex];

      if (_chainInfo &&
          this.props.PBaaSMain.showChainInfoChainIndex !== _PBaaS.showChainInfoChainIndex) {

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

  activatePbaasChain() {
    let chainDefition = this.state.chainInfo.chaindefinition

    if (this.isCoinAlreadyAdded(chainDefition.name)) {
      return;
    }

    let rpcPort;
    //Parse first time rpc port from chain info
    if (chainDefition.nodes.length && chainDefition.nodes[0].networkaddress) {
      let splitAddress = chainDefition.nodes[0].networkaddress.split(':')
      rpcPort = Number(splitAddress[1]) + 1
    }
    
    this.toggleChainInfoModal();
    Store.dispatch(addCoin(
      chainDefition.name,
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
    const _PBaaS = this.props.PBaaSMain

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
    PBaaSMain: {
      definedChains: state.PBaaSMain.definedChains,
      showChainInfoChainIndex: state.PBaaSMain.showChainInfoChainIndex,
      showChainInfo: state.PBaaSMain.showChainInfo,
      activeSectionPbaas: state.PBaaSMain.activeSectionPbaas,
      rootChainHeight: state.PBaaSMain.rootChainHeight
    },
  };
};

export default connect(mapStateToProps)(PbaasChainInfo);