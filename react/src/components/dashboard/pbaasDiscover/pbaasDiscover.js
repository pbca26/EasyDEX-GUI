import React from 'react';
import { connect } from 'react-redux';
import Store from '../../../store';
import Config from '../../../config';
import mainWindow from '../../../util/mainWindow';
import { 
  PBaaSDiscoverRender,
  lastHeightRender,
  lastRewardRender,
  lastHeightHeaderRender,
  lastRewardHeaderRender,
  notaryRewardRender,
  chainDetailRender,
  premineRender,
  statusRender,
  chainNameRender,
  ChainsListRender
} from './pbaasDiscover.render';
import { 
  getDefinedChains, 
  triggerToaster, 
  addCoin,
  dashboardChangeSectionState,
  toggleDashboardActiveSection,
  updatePbaasDefinedChains,
  togglePbaasChainInfoModal
} from '../../../actions/actionCreators'
import translate from '../../../translate/translate';
import DoubleScrollbar from 'react-double-scrollbar';
import { estimateReward } from '../../../util/pbaas/pbaasTxUtils';
import { 
  BOTTOM_BAR_DISPLAY_THRESHOLD,
  NATIVE_MODE,
  VERUS_DAEMON
} from '../../../util/constants'

class PBaaSDiscover extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      itemsListColumns: this.generateItemsListColumns(),
      filteredItemsList: [],
      itemsList: [],
      pageSize: 20,
      showPagination: false,
      defaultPageSize: 20,
      filterMenuOpen: false,
      searchTerm: null,
      chains: [],
      includePremine: true,
      includeNoPremine: true,
      loading: true
    };

    this.updateInput = this.updateInput.bind(this)
    this.toggleFilterMenuOpen = this.toggleFilterMenuOpen.bind(this)
    this._setChains = this._setChains.bind(this)
  }

  componentWillMount() {
    this.fetchChainsInfo();
  }

  onSearchTermChange(newSearchTerm) {
    let _chains = this.props.PBaaSMain.definedChains
    let _searchTerm = newSearchTerm
    
    if (!isNaN(_searchTerm)) {
      _searchTerm = _searchTerm.replace('.', '')
    }

    this.setState(Object.assign({}, this.state, {
      searchTerm: _searchTerm,
      filteredItemsList: this.filterChains(_chains, _searchTerm),
    }));
  }

  onPageSizeChange(pageSize, pageIndex) {
    this.setState(Object.assign({}, this.state, {
      pageSize: pageSize,
      showPagination: this.state.itemsList && this.state.itemsList.length >= this.state.defaultPageSize,
    }));
  }

  _setChains() {
    let _chains = this.props.PBaaSMain.definedChains
    let _stateChange = {}
    
    if (_chains &&
      _chains.length) {
      _stateChange = Object.assign({}, _stateChange, {
        filteredItemsList: this.filterChains(_chains, this.state.searchTerm),
        showPagination: _chains && _chains.length >= this.state.defaultPageSize,
        itemsListColumns: this.generateItemsListColumns(),
      });
    } else {
      _stateChange = Object.assign({}, _stateChange, {
        filteredItemsList: [],
        showPagination: false,
        itemsListColumns: this.generateItemsListColumns(),
      });
    }

    this.setState(_stateChange)
  }

  filterChains(chainList, searchTerm) {
    return chainList.filter(chain => this.filterChain(chain, searchTerm));
  }

  filterChain(chain, term) {
    if (!term)
    {
      return true;
    }
    else if (
      (this.contains(chain.chaindefinition.notarizationreward, term) ||
      this.contains(chain.chaindefinition.name, term) ||
      this.contains(chain.lastconfirmedheight, term) ||
      this.contains(estimateReward(chain.chaindefinition, chain.lastconfirmedheight), term)))
    {
      return true;
    }
  }

  fetchChainsInfo() {
    this.setState({
      loading: true
    }, () => {
      getDefinedChains()
      .then((res) => {
        if (!res.error && res.result.length) {
          Store.dispatch(updatePbaasDefinedChains(res.result))
        } 
  
        this.setState({
          loading: false
        }, () => {
          this._setChains();
        })
      })
    })
  }

  contains(value, property) {
    return ((value + '').toLowerCase()).indexOf(property.toLowerCase()) !== -1
  }

  toggleFilterMenuOpen() {
    this.setState({
      filterMenuOpen: !this.state.filterMenuOpen,
    });
  }

  updateInput(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  activatePbaasChain() {
    if (this.isCoinAlreadyAdded(this.state.chainInfo.chaindefinition.name)) {
      return;
    }

    let rpcPort;
    //Parse first time rpc port from chain info
    if (this.state.chainInfo.chaindefinition.nodes.length && this.state.chainInfo.chaindefinition.nodes[0].networkaddress) {
      let splitAddress = this.state.chainInfo.chaindefinition.nodes[0].networkaddress.split(':')
      rpcPort = Number(splitAddress[1]) + 1
    }
    
    Store.dispatch(addCoin(
      this.state.chainInfo.chaindefinition.name,
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

  renderChainsList() {  
    let _chains = this.props.PBaaSMain.definedChains

    if (_chains.length) {
      return (
        <DoubleScrollbar>
          { ChainsListRender.call(this) }
        </DoubleScrollbar>
      );
    } else if (this.state.loading) {
      return (
        <div className="padding-left-15">{ translate('INDEX.LOADING') + "..."}</div>
      );
    } else {
      return (
        <div className="padding-left-15">{ translate('PBAAS.NO_CHAINS') }</div>
      );
    }
  }

  toggleChainInfoModal(display, chainIndex) {
    const _chains = this.props.PBaaSMain.definedChains

    if (this.state.searchTerm || 
        !this.state.includePremine || 
        !this.state.includeNoPremine) {
      let chain = this.state.filteredItemsList[chainIndex];

      chainIndex = _chains.findIndex(k => k === chain);
      Store.dispatch(togglePbaasChainInfoModal(display, chainIndex));
    }
    else {
      Store.dispatch(togglePbaasChainInfoModal(display, chainIndex));
    }
  }

  defaultSorting(a, b) {
    a = a.props.children;
    b = b.props.children;
    // force null and undefined to the bottom
    a = (a === null || a === undefined) ? -Infinity : a;
    b = (b === null || b === undefined) ? -Infinity : b;
    // force any string values to lowercase
    a = typeof a === 'string' ? a.toLowerCase() : a;
    b = typeof b === 'string' ? b.toLowerCase() : b;
    // Return either 1 or -1 to indicate a sort priority
    if (a > b) {
      return 1;
    }
    if (a < b) {
      return -1;
    }
    // returning 0 or undefined will use any subsequent column sorting methods or the row index as a tiebreaker
    return 0;
  }

  rewardSorting(a, b) {
    a = Number(a.props.children);
    b = Number(b.props.children);
    // force null and undefined to the bottom
    a = (a === null || a === undefined) ? -Infinity : a;
    b = (b === null || b === undefined) ? -Infinity : b;
    // force any string values to lowercase
    a = typeof a === 'string' ? a.toLowerCase() : a;
    b = typeof b === 'string' ? b.toLowerCase() : b;
    // Return either 1 or -1 to indicate a sort priority
    if (a > b) {
      return 1;
    }
    if (a < b) {
      return -1;
    }
    // returning 0 or undefined will use any subsequent column sorting methods or the row index as a tiebreaker
    return 0;
  }

  generateItemsListColumns() {
    const _chains = this.props.PBaaSMain.definedChains
    const _currentHeight = this.props.CurrentHeight

    let columns = [{
      id: 'name',
      Header: translate('PBAAS.NAME'),
      Footer: translate('PBAAS.NAME'),
      sortMethod: this.defaultSorting,
      accessor: (chain) => chainNameRender.call(this, chain),
    },
    {
      id: 'status',
      Header: translate('PBAAS.CHAIN_STATUS'),
      Footer: translate('PBAAS.CHAIN_STATUS'),
      sortMethod: this.defaultSorting,
      accessor: (chain) => statusRender.call(this, chain, _currentHeight),
    },
    {
      id: 'premine',
      Header: translate('PBAAS.PREMINE'),
      Footer: translate('PBAAS.PREMINE'),
      sortMethod: this.defaultSorting,
      accessor: (chain) => premineRender.call(this, chain),
    },
    {
      id: 'lastnotarization',
      Header: lastHeightHeaderRender,
      Footer: translate('PBAAS.LAST_NOTARY_HEIGHT'),
      sortMethod: this.defaultSorting,
      accessor: (chain) => lastHeightRender.call(this, chain),
    },
    {
      id: 'lastblockreward',
      Header: lastRewardHeaderRender,
      Footer: translate('PBAAS.LAST_BLOCK_REWARD'),
      sortMethod: this.defaultSorting,
      accessor: (chain) => lastRewardRender.call(this, chain),
    },
    {
      id: 'notarizationreward',
      Header: translate('PBAAS.NOTARY_REWARD'),
      Footer: translate('PBAAS.NOTARY_REWARD'),
      sortMethod: this.rewardSorting,
      accessor: (chain) => notaryRewardRender.call(this, chain),
    },
    {
      id: 'chain-detail',
      Header: translate('PBAAS.CHAIN_INFO'),
      Footer: translate('PBAAS.CHAIN_INFO'),
      className: 'colum--txinfo',
      headerClassName: 'colum--txinfo',
      footerClassName: 'colum--txinfo',
      Cell: props => chainDetailRender.call(this, props.index),
      maxWidth: '100',
      sortable: false,
      filterable: false,
    }];

    if (_chains.length <= BOTTOM_BAR_DISPLAY_THRESHOLD) {
      return columns.map((column, index) => {
        delete column.Footer
        return column
      })
    } else {
      return columns
    }

  }

  render() {
    return PBaaSDiscoverRender.call(this);
  }
}

const mapStateToProps = (state) => {
  return {
    Main: state.Main,
    PBaaSMain: {
      activeSectionPbaas: state.PBaaSMain.activeSectionPbaas,
      showChainInfo: state.PBaaSMain.showChainInfo,
      showChainInfoChainIndex: state.PBaaSMain.showChainInfoChainIndex,
      definedChains: state.PBaaSMain.definedChains
    },
    CurrentHeight: state.ActiveCoin.progress.longestchain
  }
};

export default connect(mapStateToProps)(PBaaSDiscover);