import React from 'react';
import { connect } from 'react-redux';
import translate from '../../../translate/translate';
import { formatValue } from 'agama-wallet-lib/src/utils';
import Config from '../../../config';
import {
  toggleDashboardTxInfoModal,
  changeActiveAddress,
  getDashboardUpdate,
  apiElectrumBalance,
  apiElectrumKVTransactionsPromise,
  apiElectrumTransactions,
  toggleClaimInterestModal,
  apiElectrumCheckServerConnection,
  apiElectrumSetServer,
  electrumServerChanged,
  apiElectrumTransactionsCSV,
  apiNativeTransactionsCSV,
  triggerToaster,
  apiEthereumTransactions,
  toggleMiningOptions
} from '../../../actions/actionCreators';
import Store from '../../../store';
import {
  AddressTypeRender,
  TransactionDetailRender,
  AddressRender,
  AddressItemRender,
  TxTypeRender,
  TxAmountRender,
  TxHistoryListRender,
  TxConfsRender,
  AddressListRender,
  WalletsDataRender,
} from  './walletsData.render';
import { secondsToString } from 'agama-wallet-lib/src/time';
import { getRandomElectrumServer } from 'agama-wallet-lib/src/utils';
import DoubleScrollbar from 'react-double-scrollbar';
import mainWindow, { staticVar } from '../../../util/mainWindow';
import { BOTTOM_BAR_DISPLAY_THRESHOLD } from '../../../util/constants'

/*import io from 'socket.io-client';

const socket = io.connect(`http://127.0.0.1:${Config.agamaPort}`);*/

class WalletsData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      itemsList: [],
      filteredItemsList: [],
      currentAddress: null,
      addressSelectorOpen: false,
      currentStackLength: 0,
      totalStackLength: 0,
      useCache: true,
      itemsListColumns: this.generateItemsListColumns(),
      defaultPageSize: 20,
      pageSize: 20,
      showPagination: true,
      searchTerm: null,
      coin: null,
      txhistory: null,
      loading: false,
      reconnectInProgress: false,
      kvView: false,
      kvHistory: null,
      txhistoryCopy: null,
      generatingCSV: false,
      filterMenuOpen: false,
      filterPrivateTx: true,
      filterPublicTx: true,
      filterImmatureTx: true,
      filterMatureTx: true,
      filterStakeTx: true,
      filterSentTx: true,
      filterReceivedTx: true,
      filterSelfTx: true,
    };
    this.kvHistoryInterval = null;
    this.openDropMenu = this.openDropMenu.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.refreshTxHistory = this.refreshTxHistory.bind(this);
    this.openClaimInterestModal = this.openClaimInterestModal.bind(this);
    this.displayClaimInterestUI = this.displayClaimInterestUI.bind(this);
    this.spvAutoReconnect = this.spvAutoReconnect.bind(this);
    this.toggleMiningButton = this.toggleMiningButton.bind(this);
    this.toggleKvView = this.toggleKvView.bind(this);
    this._setTxHistory = this._setTxHistory.bind(this);
    this.exportToCSV = this.exportToCSV.bind(this);
    this.toggleFilterPrivateTx = this.toggleFilterPrivateTx.bind(this);
    this.toggleFilterPublicTx = this.toggleFilterPublicTx.bind(this);
    this.toggleFilterImmatureTx = this.toggleFilterImmatureTx.bind(this);
    this.toggleFilterMatureTx = this.toggleFilterMatureTx.bind(this);
    this.toggleFilterStakeTx = this.toggleFilterStakeTx.bind(this);
    this.toggleFilterSentTx = this.toggleFilterSentTx.bind(this);
    this.toggleFilterReceivedTx = this.toggleFilterReceivedTx.bind(this);
    this.toggleFilterSelfTx = this.toggleFilterSelfTx.bind(this);
    this.toggleFilterMenuOpen = this.toggleFilterMenuOpen.bind(this);
  }

  componentDidMount() {
    document.addEventListener(
      'click',
      this.handleClickOutside,
      false
    );

    //TODO: Find more efficient way to do this, it isn't performing
    //as well as it could be when it's here and also in 
    //componentwillreceiveprops
    if (this.state.itemsList.length === 0) {
      if (this.props.ActiveCoin.coin !== 'BEER' &&
      this.props.ActiveCoin.coin !== 'PIZZA' &&
      this.props.ActiveCoin.coin !== 'KV') {
        this.setState({
          kvView: false,
        });
      }

      this._setTxHistory();
    }
  }

  componentWillUnmount() {
    document.removeEventListener(
      'click',
      this.handleClickOutside,
      false
    );
  }

  componentWillReceiveProps(props) {
    if (props.ActiveCoin.coin !== 'BEER' &&
        props.ActiveCoin.coin !== 'PIZZA' &&
        props.ActiveCoin.coin !== 'KV') {
      this.setState({
        kvView: false,
      });
    }

    this._setTxHistory();
  }

  isOutValue(tx) {
    if (this.props.ActiveCoin.mode === 'spv' &&
        (tx.category === 'send' || tx.category === 'sent') ||
        (tx.type === 'send' || tx.type === 'sent') &&
        tx.amount > 0) {
      tx.amount = tx.amount * -1;
      return tx;
    } else {
      return tx;
    }
  }

  exportToCSV() {
    const _coin = this.props.ActiveCoin.coin;

    this.setState({
      generatingCSV: true,
    });

    if (this.props.ActiveCoin.mode === 'spv') {
      apiElectrumTransactionsCSV(
        _coin,
        this.props.Dashboard.electrumCoins[_coin].pub
      )
      .then((res) => {
        this.setState({
          generatingCSV: false,
        });

        if (res.msg === 'success') {
          Store.dispatch(
            triggerToaster(
              `${translate('INDEX.CSV_EXPORT_SAVED')} ${res.result}`,
              translate('INDEX.TX_HISTORY_EXPORT'),
              'success toastr-wide selectable',
              false
            )
          );
        } else {
          Store.dispatch(
            triggerToaster(
              res.result,
              translate('INDEX.CSV_EXPORT_ERR'),
              'error'
            )
          );
        }
      });
    } else {
      apiNativeTransactionsCSV(_coin)
      .then((res) => {
        this.setState({
          generatingCSV: false,
        });

        if (res.msg === 'success') {
          Store.dispatch(
            triggerToaster(
              `${translate('INDEX.CSV_EXPORT_SAVED')} ${res.result}`,
              translate('INDEX.TX_HISTORY_EXPORT'),
              'success toastr-wide selectable',
              false
            )
          );
        } else {
          Store.dispatch(
            triggerToaster(
              res.result,
              translate('INDEX.CSV_EXPORT_ERR'),
              'error'
            )
          );
        }
      });
    }
  }

  toggleKvView() {
    const _coin = this.props.ActiveCoin.coin;
    const _pub = this.props.Dashboard.electrumCoins[_coin].pub;

    this.setState({
      kvView: !this.state.kvView,
    });

    if (!this.state.kvView) {
      apiElectrumKVTransactionsPromise(
        _coin,
        _pub
      )
      .then((res) => {
        // console.warn('kvHistory', res);

        if (res.msg === 'success') {
          this.setState({
            kvHistory: res.result && res.result.length ? res.result : 'no data',
            txhistoryCopy: this.state.txhistory,
            searchTerm: '',
          });

          setTimeout(() => {
            this._setTxHistory();
          }, 200);
        }
      });
    } else {
      Store.dispatch(apiElectrumTransactions(
        _coin,
        _pub
      ));
    }
  }

  toggleMiningButton() {
    Store.dispatch(toggleMiningOptions(this.props.ActiveCoin.coin))
  }

  toggleFilterMenuOpen() {
    this.setState({
      filterMenuOpen: !this.state.filterMenuOpen,
    });
  }

  displayClaimInterestUI() {
    const _balance = this.props.ActiveCoin.balance;

    if (this.props.ActiveCoin &&
        this.props.ActiveCoin.coin === 'KMD' &&
        _balance) {
      if (_balance.interest &&
          _balance.interest > 0) {
        return this.props.ActiveCoin.mode === 'spv' && mainWindow.isWatchOnly() ? -888 : 777;
      } else if (
        (_balance.transparent && _balance.transparent >= 10) ||
        (_balance.balance && _balance.balance >= 10)
      ) {
        return -777;
      }
    }
  }

  openClaimInterestModal() {
    Store.dispatch(toggleClaimInterestModal(true));
  }

  typeSorting(a, b) {
    a = a.props.children.props.className;
    b = b.props.children.props.className;
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

  destSorting(a, b) {
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

  directionSorting(a, b) { // ugly workaround, override default sort
    let aBtm = null;
    let bBtm = null;
    if (Array.isArray(a.props.children[2].props.children)) {
      a = a.props.children[2].props.children[0];
    }
    else {
      if (a.props.children[2].props.children === 'Immature'){
        aBtm = a.props.children[4].props.children.match(/\d+/g);
      }
      else {
        a = a.props.children[2].props.children
      }
    }

    if (Array.isArray(b.props.children[2].props.children)) {
      b = b.props.children[2].props.children[0];
    }
    else {
      if (b.props.children[2].props.children === 'Immature'){
        bBtm = b.props.children[4].props.children.match(/\d+/g);
      }
      else {
        b = b.props.children[2].props.children
      }
    }

    // force null and undefined to the bottom
    a = (a === null || a === undefined) ? -Infinity : a;
    b = (b === null || b === undefined) ? -Infinity : b;
    // force any string values to lowercase
    a = typeof a === 'string' ? a.toLowerCase() : a;
    b = typeof b === 'string' ? b.toLowerCase() : b;
    // Return either 1 or -1 to indicate a sort priority
    if (aBtm && bBtm) {
      if (aBtm > bBtm) {
        return 1;
      }
      if (aBtm < bBtm) {
        return -1;
      }
    }
    else if (aBtm && !bBtm) {
      return 1;
    }
    else if (!aBtm && bBtm) {
      return -1;
    }
    else {
      if (a > b) {
        return 1;
      }
      if (a < b) {
        return -1;
      }
    }
    // returning 0 or undefined will use any subsequent column sorting methods or the row index as a tiebreaker
    return 0;
  }

  confSorting(a, b) {
    a = a.props.children[1].props.children;
    b = b.props.children[1].props.children;
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

  // https://react-table.js.org/#/custom-sorting
  tableDateSorting(a, b) { // ugly workaround, override default sort
    if (Date.parse(a)) { // convert date to timestamp
      a = Date.parse(a);
    }
    if (Date.parse(b)) {
      b = Date.parse(b);
    }
    // force null and undefined to the bottom
    a = (a === null || a === undefined) ? -Infinity : a;
    b = (b === null || b === undefined) ? -Infinity : b;
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

  amountSorting(a, b) {
    a = a.props.children[0];
    b = b.props.children[0];
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

  defaultSorting(a, b) {
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

  generateItemsListColumns(itemsCount) {
    let columns = [];
    let _col;

    if (this.props.ActiveCoin.mode === 'native') {
      _col = {
        id: 'type',
        Header: translate('INDEX.TYPE'),
        Footer: translate('INDEX.TYPE'),
        className: 'colum--type',
        headerClassName: 'colum--type',
        footerClassName: 'colum--type',
        sortMethod: this.typeSorting,
        accessor: (tx) => AddressTypeRender.call(this, tx),
      };

      if (itemsCount <= BOTTOM_BAR_DISPLAY_THRESHOLD) {
        delete _col.Footer;
      }

      columns.push(_col);
    }

    _col = [{
      id: 'direction',
      Header: translate('INDEX.DIRECTION'),
      Footer: translate('INDEX.DIRECTION'),
      className: 'colum--direction',
      headerClassName: 'colum--direction',
      footerClassName: 'colum--direction',
      sortMethod: this.directionSorting,
      accessor: (tx) => TxTypeRender.call(this, tx),
    },
    {
      id: 'confirmations',
      Header: translate('INDEX.CONFIRMATIONS'),
      Footer: translate('INDEX.CONFIRMATIONS'),
      headerClassName: 'hidden-xs hidden-sm',
      footerClassName: 'hidden-xs hidden-sm',
      className: 'hidden-xs hidden-sm',
      sortMethod: this.confSorting,
      accessor: (tx) => TxConfsRender.call(this, tx),
    },
    {
      id: 'amount',
      Header: translate('INDEX.AMOUNT'),
      Footer: translate('INDEX.AMOUNT'),
      sortMethod: this.amountSorting,
      accessor: (tx) => TxAmountRender.call(this, tx),
    },
    {
      id: 'timestamp',
      Header: translate('INDEX.TIME'),
      Footer: translate('INDEX.TIME'),
      sortMethod: this.tableDateSorting,
      accessor: (tx) => secondsToString(tx.timestamp || tx.time || tx.blocktime),
    }];

    if (itemsCount <= BOTTOM_BAR_DISPLAY_THRESHOLD) {
      delete _col[0].Footer;
      delete _col[1].Footer;
      delete _col[2].Footer;
      delete _col[3].Footer;
    }

    columns.push(..._col);

    _col = {
      id: 'destination-address',
      Header: translate('INDEX.DEST_ADDRESS'),
      Footer: translate('INDEX.DEST_ADDRESS'),
      sortMethod: this.destSorting,
      accessor: (tx) => AddressRender.call(this, tx.address),
    };

    if (itemsCount <= BOTTOM_BAR_DISPLAY_THRESHOLD) {
      delete _col.Footer;
    }

    columns.push(_col);

    if (this.props.ActiveCoin.mode === 'spv' ||
        this.props.ActiveCoin.mode === 'eth') {
      _col = {
        id: 'tx-detail',
        Header: translate('INDEX.TX_DETAIL'),
        Footer: translate('INDEX.TX_DETAIL'),
        className: 'colum--txinfo',
        headerClassName: 'colum--txinfo',
        footerClassName: 'colum--txinfo',
        accessor: (tx) => TransactionDetailRender.call(this, tx),
        sortable: false,
        filterable: false,
      };

      if (itemsCount <= BOTTOM_BAR_DISPLAY_THRESHOLD) {
        delete _col.Footer;
      }

      columns.push(_col);
    } else {
      _col = {
        id: 'tx-detail',
        Header: translate('INDEX.TX_DETAIL'),
        Footer: translate('INDEX.TX_DETAIL'),
        className: 'colum--txinfo',
        headerClassName: 'colum--txinfo',
        footerClassName: 'colum--txinfo',
        Cell: props => TransactionDetailRender.call(this, props.index),
        maxWidth: '100',
        sortable: false,
        filterable: false,
      };

      if (itemsCount <= BOTTOM_BAR_DISPLAY_THRESHOLD) {
        delete _col.Footer;
      }

      columns.push(_col);
    }

    // TODO: kv sorting
    if (this.state &&
        this.state.kvView) {
      columns = [];

      _col = [{
        id: 'direction',
        Header: translate('INDEX.DIRECTION'),
        Footer: translate('INDEX.DIRECTION'),
        className: 'colum--direction',
        headerClassName: 'colum--direction',
        footerClassName: 'colum--direction',
        accessor: (tx) => TxTypeRender.call(this, tx),
      },
      {
        id: 'tag',
        Header: translate('KV.TAG'),
        Footer: translate('KV.TAG'),
        headerClassName: 'hidden-xs hidden-sm',
        footerClassName: 'hidden-xs hidden-sm',
        className: 'hidden-xs hidden-sm selectable',
        accessor: (tx) => tx.opreturn.kvDecoded.tag,
      },
      {
        id: 'title',
        Header: translate('KV.TITLE'),
        Footer: translate('KV.TITLE'),
        className: 'selectable',
        accessor: (tx) => tx.opreturn.kvDecoded.content.title,
      },
      {
        id: 'timestamp',
        Header: translate('INDEX.TIME'),
        Footer: translate('INDEX.TIME'),
        accessor: (tx) => secondsToString(tx.timestamp || tx.time || tx.blocktime),
      },
      {
        id: 'tx-detail',
        Header: translate('KV.CONTENT'),
        Footer: translate('KV.CONTENT'),
        className: 'colum--txinfo selectable',
        headerClassName: 'colum--txinfo',
        footerClassName: 'colum--txinfo',
        accessor: (tx) => TransactionDetailRender.call(this, tx),
      }];

      columns.push(..._col);

      if (itemsCount <= BOTTOM_BAR_DISPLAY_THRESHOLD) {
        delete _col[0].Footer;
        delete _col[1].Footer;
        delete _col[2].Footer;
        delete _col[3].Footer;
        delete _col[4].Footer;
      }
    }

    return columns;
  }

  handleClickOutside(e) {
    const _srcElement = e ? e.srcElement : null;

    if (this.state.addressSelectorOpen &&
        e &&
        _srcElement &&
        _srcElement.className !== 'btn dropdown-toggle btn-info' &&
        (_srcElement.offsetParent && _srcElement.offsetParent.className !== 'btn dropdown-toggle btn-info') &&
        (e.path && e.path[4] && e.path[4].className.indexOf('showkmdwalletaddrs') === -1) &&
        (_srcElement.offsetParent && _srcElement.offsetParent.className.indexOf('dropdown') === -1) &&
        _srcElement.className !== 'dropdown-toggle btn-xs btn-default') {
      this.setState({
        addressSelectorOpen: false,
      });
    }
  }

  refreshTxHistory() {
    const _coin = this.props.ActiveCoin.coin;
    const _mode = this.props.ActiveCoin.mode;

    this.setState({
      loading: true,
    });
    setTimeout(() => {
      this.setState({
        loading: false,
      });
    }, 1000);

    if (this.state.kvView) {
      const _pub = this.props.Dashboard.electrumCoins[_coin].pub;
      
      apiElectrumKVTransactionsPromise(
        _coin,
        _pub
      )
      .then((res) => {
        // console.warn('kvHistory', res);

        if (res.msg === 'success') {
          this.setState({
            kvHistory: res.result && res.result.length ? res.result : 'no data',
            txhistoryCopy: this.state.txhistory,
            searchTerm: '',
          });

          setTimeout(() => {
            this._setTxHistory();
          }, 200);
        }
      });
    } else {
      if (_mode === 'native') {
        Store.dispatch(getDashboardUpdate(_coin));
      } else if (_mode === 'spv') {
        const _pub = this.props.Dashboard.electrumCoins[_coin].pub;
                
        Store.dispatch(
          apiElectrumTransactions(
            _coin,
            _pub
          )
        );
      } else if (_mode === 'eth') {
        const _pub = this.props.Dashboard.ethereumCoins[_coin].pub;
                
        Store.dispatch(
          apiEthereumTransactions(
            _coin,
            _pub
          )
        );
      }
    }
  }

  toggleTxInfoModal(display, txIndex) {
    if (this.state.searchTerm || 
        !this.state.filterPrivateTx ||
        !this.state.filterPublicTx ||
        !this.state.filterImmatureTx ||
        !this.state.filterMatureTx ||
        !this.state.filterStakeTx ||
        !this.state.filterSentTx ||
        !this.state.filterReceivedTx ||
        !this.state.filterSelfTx) {
      let transaction = this.state.filteredItemsList[txIndex];
      txIndex = this.state.itemsList.findIndex(k => k === transaction);
      Store.dispatch(toggleDashboardTxInfoModal(display, txIndex));
    }
    else {
      Store.dispatch(toggleDashboardTxInfoModal(display, txIndex));
    }
  }

  _setTxHistory(oldTxHistory) {
    const _txhistory = this.state.kvView ? this.state.kvHistory : (oldTxHistory ? oldTxHistory : this.props.ActiveCoin.txhistory);
    let _stateChange = {};
        
    // TODO: figure out why changing ActiveCoin props doesn't trigger comp update
    if (_txhistory &&
        _txhistory !== 'loading' &&
        _txhistory !== 'no data' &&
        _txhistory !== 'connection error or incomplete data' &&
        _txhistory !== 'cant get current height' &&
        _txhistory.length) {
      _stateChange = Object.assign({}, _stateChange, {
        itemsList: _txhistory,
        filteredItemsList: this.filterTransactions(_txhistory, this.state.searchTerm),
        txhistory: _txhistory,
        showPagination: _txhistory && _txhistory.length >= this.state.defaultPageSize,
        itemsListColumns: this.generateItemsListColumns(_txhistory.length),
        reconnectInProgress: false,
      });
    }

    if (_txhistory &&
        _txhistory === 'no data') {
      _stateChange = Object.assign({}, _stateChange, {
        itemsList: 'no data',
        reconnectInProgress: false,
      });
    } else if (
      _txhistory &&
      _txhistory === 'loading'
    ) {
      _stateChange = Object.assign({}, _stateChange, {
        itemsList: 'loading',
        reconnectInProgress: false,
      });
    } else if (
      (_txhistory && _txhistory === 'connection error or incomplete data') ||
      (_txhistory && _txhistory === 'cant get current height')
    ) {
      _stateChange = Object.assign({}, _stateChange, {
        itemsList: 'connection error',
        reconnectInProgress: this.props.Dashboard.electrumCoins[this.props.ActiveCoin.coin].serverList !== 'none' ? true : false,
      });

      if (!this.state.reconnectInProgress) {
        this.spvAutoReconnect();
      }
    }
    
    this.setState(_stateChange);
  }

  spvAutoReconnect() {
    const _coin = this.props.ActiveCoin.coin;
    const _electrumCoin = this.props.Dashboard.electrumCoins[_coin];

    if (_electrumCoin.serverList !== 'none' &&
        _electrumCoin.serverList.length > 1) {
      const _spvServers = _electrumCoin.serverList;
      const _server = [
        _electrumCoin.server.ip,
        _electrumCoin.server.port,
        _electrumCoin.server.proto,
      ];
      const _randomServer = getRandomElectrumServer(
        _spvServers,
        _server.join(':')
      );

      apiElectrumCheckServerConnection(
        _randomServer.ip,
        _randomServer.port,
        _randomServer.proto
      )
      .then((res) => {
        const _server = `${_randomServer.ip}:${_randomServer.port}:${_randomServer.proto}`;
        const _coin = this.props.ActiveCoin.coin;

        if (res.result) {
          apiElectrumSetServer(
            _coin,
            _randomServer.ip,
            _randomServer.port,
            _randomServer.proto
          )
          .then((serverSetRes) => {
            Store.dispatch(
              triggerToaster(
                `${_coin} SPV ${translate('DASHBOARD.SERVER_SET_TO')} ${_server}`,
                translate('TOASTR.WALLET_NOTIFICATION'),
                'success'
              )
            );
            Store.dispatch(electrumServerChanged(true));

            setTimeout(() => {
              this.refreshTxHistory();
              
              Store.dispatch(
                apiElectrumBalance(
                  _coin,
                  _electrumCoin.pub
                )
              );
            }, 1000);
          });
        } else {
          Store.dispatch(
            triggerToaster(
              `${_coin} SPV ${translate('DASHBOARD.SERVER_SM')} ${_server} ${translate('DASHBOARD.IS_UNREACHABLE')}!`,
              translate('TOASTR.WALLET_NOTIFICATION'),
              'error'
            )
          );
        }
      });
    }
  }

  isFullySynced() {
    const _progress = this.props.ActiveCoin.progress;

    if (_progress &&
        (Number(_progress.balances) +
        Number(_progress.validated) +
        Number(_progress.bundles) +
        Number(_progress.utxo)) / 4 === 100) {
      return true;
    } else {
      return false;
    }
  }

  renderTxHistoryList() {
    const _coin = this.props.ActiveCoin.coin;

    if (this.state.itemsList === 'loading') {
      if (this.isFullySynced()) {
        return (
          <div className="padding-left-15">{ translate('INDEX.LOADING_HISTORY') }...</div>
        );
      } else {
        return (
          <div className="padding-left-15">{ translate('INDEX.SYNC_IN_PROGRESS') }...</div>
        );
      }
    } else if (this.state.itemsList === 'no data') {
      return (
        <div className="padding-left-15">{ translate('INDEX.NO_DATA') }</div>
      );
    } else if (this.state.itemsList === 'connection error') {
      return (
        <div className="padding-left-15">
          <div className="color-warning">
            { translate('DASHBOARD.SPV_CONN_ERROR') }
          </div>
          <div className={ this.props.Dashboard.electrumCoins[_coin].serverList !== 'none' ? '' : 'hide' }>
            <div className="color-warning padding-bottom-20">{ translate('DASHBOARD.SPV_AUTO_SWITCH') }...</div>
            <strong>{ translate('DASHBOARD.HOW_TO_SWITCH_MANUALLY') }:</strong>
            <div className="padding-top-10">{ translate('DASHBOARD.SPV_CONN_ERROR_P1') }</div>
          </div>
        </div>
      );
    } else if (
      this.state.itemsList &&
      this.state.itemsList.length
    ) {
      const _isAcPrivate = _coin !== 'KMD' && staticVar.chainParams && staticVar.chainParams[_coin] && !staticVar.chainParams[_coin].ac_private;
      
      return (
        <DoubleScrollbar>
          { TxHistoryListRender.call(this) }
          { !this.state.kvView &&
            (this.props.ActiveCoin.mode === 'spv' ||
             (this.props.ActiveCoin.mode === 'native' && (_coin === 'KMD' || _isAcPrivate))) &&
            <div className="margin-left-5 margin-top-30">
              <span
                className="pointer"
                onClick={ this.exportToCSV }>
                <i className="icon fa-file-excel-o margin-right-10"></i>{ translate('INDEX.' + (this.state.generatingCSV ? 'GENERATING_CSV' : 'EXPORT_TO_CSV')) }
              </span>
            </div>
          }
        </DoubleScrollbar>
      );
    }

    return null;
  }

  onPageSizeChange(pageSize, pageIndex) {
    this.setState(Object.assign({}, this.state, {
      pageSize: pageSize,
      showPagination: this.state.itemsList && this.state.itemsList.length >= this.state.defaultPageSize,
    }));
  }

  updateAddressSelection(address) {
    Store.dispatch(changeActiveAddress(address));

    this.setState(Object.assign({}, this.state, {
      currentAddress: address,
      addressSelectorOpen: false,
    }));
  }

  updateAddressTypeSelection(filter) {
    this.setState({
      addressFilterType: filter,
      filteredItemsList: this.filterTransactions(this.state.itemsList, this.state.searchTerm),
      filterSelectorOpen: false,
    }, () => {
      this._setTxHistory();
    });
  }

  toggleFilterPrivateTx(){
    this.setState({
      filterPrivateTx: !this.state.filterPrivateTx,
    }, () => {
      this._setTxHistory();
    });
  }

  toggleFilterPublicTx(){
    this.setState({
      filterPublicTx: !this.state.filterPublicTx,
    }, () => {
      this._setTxHistory();
    });
  }

  toggleFilterImmatureTx(){
    this.setState({
      filterImmatureTx: !this.state.filterImmatureTx,
    }, () => {
      this._setTxHistory();
    });
  }

  toggleFilterMatureTx(){
    this.setState({
      filterMatureTx: !this.state.filterMatureTx,
    }, () => {
      this._setTxHistory();
    });
  }

  toggleFilterStakeTx(){
    this.setState({
      filterStakeTx: !this.state.filterStakeTx,
    }, () => {
      this._setTxHistory();
    });
  }

  toggleFilterSentTx(){
    this.setState({
      filterSentTx: !this.state.filterSentTx,
    }, () => {
      this._setTxHistory();
    });
  }

  toggleFilterReceivedTx(){
    this.setState({
      filterReceivedTx: !this.state.filterReceivedTx,
    }, () => {
      this._setTxHistory();
    });
  }

  toggleFilterSelfTx(){
    this.setState({
      filterSelfTx: !this.state.filterSelfTx,
    }, () => {
      this._setTxHistory();
    });
  }

  openDropMenu() {
    this.setState(Object.assign({}, this.state, {
      addressSelectorOpen: !this.state.addressSelectorOpen,
    }));
  }

  renderAddressByType(type) {
    const _addresses = this.props.ActiveCoin.addresses;
    const _coin = this.props.ActiveCoin.coin;

    if (_addresses &&
        _addresses[type] &&
        _addresses[type].length) {
      let items = [];

      for (let i = 0; i < _addresses[type].length; i++) {
        const address = _addresses[type][i].address;
        let _amount = _addresses[type][i].amount;

        if (_amount !== 'N/A') {
          _amount = formatValue(_amount);
        }

        items.push(
          AddressItemRender.call(
            this,
            address,
            type,
            _amount,
            _coin
          )
        );
      }

      return items;
    }

    return null;
  }

  hasPublicAddresses() {
    const _addresses = this.props.ActiveCoin.addresses;

    return _addresses &&
      _addresses &&
      _addresses.public.length;
  }

  renderAddressAmount() {
    if (this.hasPublicAddresses()) {
      const _addresses = this.props.ActiveCoin.addresses;
      const _coin = this.props.ActiveCoin.coin;

      for (let i = 0; i < _addresses.public.length; i++) {
        if (_addresses.public[i].address === this.state.currentAddress) {
          if (_addresses.public[i].amount &&
              _addresses.public[i].amount !== 'N/A') {
            let _amount = _addresses.public[i].amount;

            if (_amount !== 'N/A') {
              _amount = formatValue(_amount);
            }

            return _amount;
          } else {
            const address = _addresses.public[i].address;
            let _amount = _addresses.public[i].amount;

            if (_amount !== 'N/A') {
              _amount = formatValue(_amount);
            }

            return _amount;
          }
        }
      }
    } else {
      return 0;
    }
  }

  renderSelectorCurrentLabel() {
    const _currentAddress = this.state.currentAddress;

    if (_currentAddress) {
      return (
        <span>
          <i className={ 'icon fa-eye' + (this.state.addressType === 'public' ? '' : '-slash') }></i>&nbsp;&nbsp;
          <span className="text">
            [ { this.renderAddressAmount() } { this.props.ActiveCoin.coin } ]&nbsp;&nbsp;
            <span className="selectable">{ _currentAddress }</span>
          </span>
        </span>
      );
    } else {
      return (
        <span>{ translate('INDEX.FILTER_BY_ADDRESS') }</span>
      );
    }
  }

  onSearchTermChange(newSearchTerm) {
    this.setState(Object.assign({}, this.state, {
      searchTerm: newSearchTerm,
      filteredItemsList: this.filterTransactions(this.state.itemsList, newSearchTerm),
    }));
  }

  filterTransactions(txList, searchTerm) {
    return txList.filter(tx => this.filterTransaction(tx, searchTerm));
  }

  filterTransaction(tx, term) {
    if (!this.state.filterPrivateTx){
      if (this.isPrivate(tx)){
        return false;
      }
    }
    if (!this.state.filterPublicTx){
      if (this.isPublic(tx)){
        return false;
      }
    }
    if (!this.state.filterImmatureTx){
      if (this.isImmature(tx)){
        return false;
      }
    }
    if (!this.state.filterMatureTx){
      if (this.isMature(tx)){
        return false;
      }
    }
    if (!this.state.filterStakeTx){
      if (this.isStake(tx)){
        return false;
      }
    }
    if (!this.state.filterSentTx){
      if (this.isSent(tx)){
        return false;
      }
    }
    if (!this.state.filterReceivedTx){
      if (this.isReceived(tx)){
        return false;
      }
    }
    if (!this.state.filterSelfTx){
      if (this.isSelf(tx)){
        return false;
      }
    }
    if (!term)
    {
      return true;
    }
    else if (
      (this.contains(tx.address, term) ||
      this.contains(tx.confirmations, term) ||
      this.contains(tx.amount, term) ||
      this.contains(tx.type, term) ||
      this.contains(secondsToString(tx.blocktime || tx.timestamp || tx.time), term))) 
    {
      return true;
    }
  }

  isPrivate(tx){
    if(tx.address) {
      if(tx.memo || (tx.address.length === 95 || tx.address.length === 78)){
        return true;
      }
    }
    else if (!tx.address) {
      return true
    }
    else {
      return false;
    }
  }

  isPublic(tx){
    return !this.isPrivate(tx);
  }

  isImmature(tx){
    return tx.category === 'immature';
  }

  isSent(tx){
    return tx.category === 'send' || tx.type === 'sent';
  }

  isReceived(tx){
    return tx.category === 'receive' || tx.type === 'received';
  } 

  isMature(tx){
    return tx.category === 'generate' || tx.category === 'mint';
  }

  isStake(tx){
    return tx.category === 'stake';
  }

  isSelf(tx){
    return tx.type === 'self';
  }

  contains(value, property) {
    return (value + '').indexOf(property) !== -1;
  }

  isActiveCoinMode(coinMode) {
    return this.props.ActiveCoin.mode === coinMode;
  }

  render() {
    return (this.props ? WalletsDataRender.call(this) : null)
  }
}

const mapStateToProps = (state) => {
  return {
    ActiveCoin: {
      coins: state.ActiveCoin.coins,
      coin: state.ActiveCoin.coin,
      mode: state.ActiveCoin.mode,
      send: state.ActiveCoin.send,
      receive: state.ActiveCoin.receive,
      balance: state.ActiveCoin.balance,
      cache: state.ActiveCoin.cache,
      activeSection: state.ActiveCoin.activeSection,
      activeAddress: state.ActiveCoin.activeAddress,
      lastSendToResponse: state.ActiveCoin.lastSendToResponse,
      addresses: state.ActiveCoin.addresses,
      txhistory: state.ActiveCoin.txhistory,
      showTransactionInfo: state.ActiveCoin.showTransactionInfo,
      progress: state.ActiveCoin.progress,
    },
    AddressBook: state.Settings.addressBook,
    Main: state.Main,
    Dashboard: state.Dashboard,
    Mining: state.Mining
  };
};

export default connect(mapStateToProps)(WalletsData);