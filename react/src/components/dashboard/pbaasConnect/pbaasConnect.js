import React from 'react';
import { connect } from 'react-redux';
import Store from '../../../store';
import Config from '../../../config';
import mainWindow from '../../../util/mainWindow';
import { 
  PBaaSConnectRender,
} from './pbaasConnect.render';
import { 
  getChainDefinition, 
  triggerToaster, 
  addCoin,
  dashboardChangeSectionState,
  toggleDashboardActiveSection,
  dashboardChangeActiveCoin
} from '../../../actions/actionCreators'
import translate from '../../../translate/translate';
import {
  NATIVE_MODE,
  VERUS_DAEMON
} from '../../../util/constants'

const { shell } = window.require('electron');

class PBaaSConnect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      resultsShown: false,
      chain: '',
      loading: false,
      chainInfo: {
        name: '',
        startblock: '',
        premine: '',
        notarizationreward: '',
        eras: [],
        conversion: '',
        conversionpercent: '',
        version: ''
      }
    };

    this.updateInput = this.updateInput.bind(this)
  }

  getChainInfo() {
    const _chain = this.state.chain

    this.setState({
      loading: true,
    }, () => {
      getChainDefinition(_chain)
      .then((json) => {
        if (json.result) {
          this.setState({
            loading: false,
            chainInfo: json.result,
            resultsShown: true
          }, () => {
            Store.dispatch(
              triggerToaster(
                translate('PBAAS.CHAIN_FOUND', _chain),
                translate('TOASTR.SUCCESS'),
                'success'
              )
            );
          })
        } else {
          this.setState({
            loading: false,
          }, () => {
            Store.dispatch(
              triggerToaster(
                translate('PBAAS.ERROR_FETCHING_CHAIN') + _chain,
                translate('TOASTR.ERROR'),
                'error'
              )
            );
          })
        }
      })
    });
  }

  updateInput(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  hideChainData() {
    this.setState({
      resultsShown: false,
    });
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
    return PBaaSConnectRender.call(this);
  }
}

const mapStateToProps = (state) => {
  return {
    Main: state.Main,
    PBaaSMain: {
      activeSectionPbaas: state.PBaaSMain.activeSectionPbaas,
      rootChainHeight: state.PBaaSMain.rootChainHeight
    },
  };
};

export default connect(mapStateToProps)(PBaaSConnect);