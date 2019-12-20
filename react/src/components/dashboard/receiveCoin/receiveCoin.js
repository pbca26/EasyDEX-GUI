import React from 'react';
import { connect } from 'react-redux';
import {
  copyCoinAddress,
  getNewKMDAddresses,
  dumpPrivKey,
  copyString,
  triggerToaster,
  validateAddress,
} from '../../../actions/actionCreators';
import Store from '../../../store';
import {
  AddressActionsNonBasiliskModeRender,
  AddressItemRender,
  ReceiveCoinRender,
  _ReceiveCoinTableRender,
  AddressRender,
  AddressTypeRender,
  AddressAmountRender,
  AddressReserveAmountRender,
  AddressListRender
} from './receiveCoin.render';
import translate from '../../../translate/translate';
import mainWindow, { staticVar } from '../../../util/mainWindow';
import Config from '../../../config';
import { BOTTOM_BAR_DISPLAY_THRESHOLD } from '../../../util/constants'
import { isPbaasChain } from '../../../util/pbaas/pbaasChainUtils';

// TODO: implement balance/interest sorting

class ReceiveCoin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openDropMenu: false,
      hideZeroAddresses: false,
      toggledAddressMenu: null,
      toggleIsMine: false,
      visible: true,
      itemsListColumns: this.generateItemsListColumns(),
      addresses: [],
      pageSize: 20,
      showPagination: false,
      defaultPageSize: 20,
    };
    this.openDropMenu = this.openDropMenu.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.toggleVisibleAddress = this.toggleVisibleAddress.bind(this);
    this.checkTotalBalance = this.checkTotalBalance.bind(this);
    this.ReceiveCoinTableRender = _ReceiveCoinTableRender.bind(this);
    this.toggleAddressMenu = this.toggleAddressMenu.bind(this);
    this.toggleIsMine = this.toggleIsMine.bind(this);
    this.validateCoinAddress = this.validateCoinAddress.bind(this);
    this.copyPubkeyNative = this.copyPubkeyNative.bind(this);
    this.generateAddressList = this.generateAddressList.bind(this);
    this.renderAddressList = this.renderAddressList.bind(this);
  }

  toggleAddressMenu(address, e) {
    if (e && e.target && e.target.id === "qrcode-modal-btn") return
    
    this.setState({
      toggledAddressMenu: this.state.toggledAddressMenu === address ? null : address,
    }, () => {
      //TODO: Streamline this, it is slow and performs poorly
      this.setState({itemsListColumns: this.generateItemsListColumns()})
    });
  }

  ReceiveCoinTableRender() {
    return this._ReceiveCoinTableRender();
  }

  componentWillMount() {
    document.addEventListener(
      'click',
      this.handleClickOutside,
      false
    );

    this.generateAddressList()
  }

  componentDidUpdate(prevProps, prevState) {
    if (JSON.stringify(prevProps.addresses) != JSON.stringify(this.props.addresses) ||
        prevState.toggleIsMine != this.state.toggleIsMine ||
        prevState.hideZeroAddresses != this.state.hideZeroAddresses) {
      this.generateAddressList();
    }
  }

  onPageSizeChange(pageSize, pageIndex) {
    this.setState(Object.assign({}, this.state, {
      pageSize: pageSize,
      showPagination: this.state.addresses && this.state.addresses.length >= this.state.defaultPageSize,
    }));
  }

  componentWillUnmount() {
    document.removeEventListener(
      'click',
      this.handleClickOutside,
      false
    );
  }

  copyPubkeyNative(address) {
    validateAddress(
      this.props.coin,
      address
    )
    .then((json) => {
      if (json &&
          json.pubkey) {
        Store.dispatch(copyString(json.pubkey, translate('INDEX.PUBKEY_COPIED')));
      } else {
        Store.dispatch(
          triggerToaster(
            translate('TOASTR.UNABLE_TO_COPY_PUBKEY'),
            translate('TOASTR.COIN_NOTIFICATION'),
            'error',
          )
        );
      }
    });
  }

  validateCoinAddress(address, isZaddr) {
    validateAddress(
      this.props.coin,
      address,
      isZaddr
    )
    .then((json) => {
      let _items = [];

      for (let key in json) {
        _items.push(`${key}: ${json[key]}`);
      }

      Store.dispatch(
        triggerToaster(
          _items,
          translate('TOASTR.COIN_NOTIFICATION'),
          json && json.ismine ? 'info' : 'warning',
          false,
          'toastr--validate-address'
        )
      );
    });
  }

  dumpPrivKey(address, isZaddr) {
    dumpPrivKey(
      this.props.coin,
      address,
      isZaddr
    )
    .then((json) => {
      if (json.length &&
          json.length > 10) {
        Store.dispatch(copyString(json, 'WIF ' + translate('DASHBOARD.RECEIVE_ADDR_COPIED')));
      }
    });
  }

  handleClickOutside(e) {
    const _srcElement = e ? e.srcElement : null;
    let _state = {}

    if (e &&
        _srcElement &&
        _srcElement.offsetParent &&
        _srcElement.offsetParent.className.indexOf('dropdown') === -1 &&
        (_srcElement.offsetParent && _srcElement.offsetParent.className.indexOf('dropdown') === -1)) {
      
      if (this.state.openDropMenu) _state.openDropMenu = false

      if(_srcElement.className.indexOf('receive-address-context-menu-trigger') === -1 &&
      _srcElement.className.indexOf('fa-qrcode') === -1 &&
      _srcElement.className.indexOf('receive-address-context-menu-get-qr') === -1 &&
      _srcElement.className.indexOf('qrcode-modal') === -1 &&
      _srcElement.offsetParent.className.indexOf('modal') &&
      _srcElement.offsetParent.className.indexOf('close') &&
      this.state.toggledAddressMenu != null) {
        _state.toggledAddressMenu = null
        _state.itemsListColumns = this.generateItemsListColumns()
      }
    }

    if (Object.keys(_state).length > 0) this.setState(_state)
  }

  openDropMenu() {
    this.setState(Object.assign({}, this.state, {
      openDropMenu: !this.state.openDropMenu,
    }));
  }

  copyPubkeySpv(pubkey) {
    Store.dispatch(copyString(pubkey, translate('INDEX.PUBKEY_COPIED')));
  }

  _copyCoinAddress(address) {
    Store.dispatch(copyCoinAddress(address));
  }

  renderAddressActions(address, type) {
    return AddressActionsNonBasiliskModeRender.call(this, address, type);
  }

  hasNoAmount(address) {
    return address.amount === 'N/A' || address.amount === 0;
  }

  hasNoInterest(address) {
    return address.interest === 'N/A' || address.interest === 0 || !address.interest;
  }

  getNewAddress(type) {
    Store.dispatch(getNewKMDAddresses(this.props.coin, type, this.props.mode));
  }

  toggleVisibleAddress() {
    this.setState(Object.assign({}, this.state, {
      hideZeroAddresses: !this.state.hideZeroAddresses,
    }));
  }

  toggleIsMine() {
    this.setState(Object.assign({}, this.state, {
      toggleIsMine: !this.state.toggleIsMine,
    }));
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

  checkTotalBalance() {
    let _balance = 0;

    if (this.props.balance &&
        this.props.balance.total) {
      _balance = Number(this.props.balance.total);

      if (this.props.balance.reserve) _balance += Number(this.props.balance.reserve)
    }

    return _balance;
  }

  generateAddressList() {
    const _addresses = this.props.addresses;
    const addrTypesNative = ['public', 'private']
    let addrArray = []

    if (this.props.mode === 'native') {
      addrTypesNative.forEach((type) => {
        if (_addresses &&
          _addresses[type] &&
          _addresses[type].length) {
  
          for (let i = 0; i < _addresses[type].length; i++) {
            let address = _addresses[type][i];
            address.type = type
    
            if (this.state.hideZeroAddresses) {
              if (!this.hasNoAmount(address)) {
                addrArray.push(address);
              }
    
              if (!this.state.toggleIsMine &&
                  !address.canspend &&
                  address.address.substring(0, 2) !== 'zc' &&
                  address.address.substring(0, 2) !== 'zs') {
                addrArray.pop();
              }
            } else {
              if (type === 'private' ||
                  (type === 'public' &&
                  (this.props.coin === 'KMD' ||
                    Config.reservedChains.indexOf(this.props.coin) === -1 ||
                    (staticVar.chainParams &&
                    staticVar.chainParams[this.props.coin] &&
                    !staticVar.chainParams[this.props.coin].ac_private)))) {
                  addrArray.push(address);
              }
    
              if (!this.state.toggleIsMine &&
                  !address.canspend &&
                  address.address.substring(0, 2) !== 'zc' &&
                  address.address.substring(0, 2) !== 'zs') {
                addrArray.pop();
              }
            }
          }
        }
      })
    } else if (this.props.electrumCoins &&
          this.props.mode === 'spv') {
        if (mainWindow.multisig &&
            mainWindow.multisig.addresses &&
            mainWindow.multisig.addresses[this.props.coin.toUpperCase()]) {

          addrArray.push({
            address: mainWindow.multisig.addresses[this.props.coin.toUpperCase()],
            amount: this.props.balance.balance,
            type: 'public'
          })

        } else {

          addrArray.push({
            address:  this.props.electrumCoins[this.props.coin].pub,
            amount: this.props.balance.balance,
            type: 'public'
          })

        }
    } else if (
      this.props.ethereumCoins &&
      this.props.mode === 'eth'
    ) {

      addrArray.push({
        address: this.props.ethereumCoins[this.props.coin].pub,
        amount: this.props.balance.balance,
        type: 'public'
      })

    } else {
      return null;
    }

    this.setState({
      addresses: addrArray,
      showPagination: addrArray.length >= this.state.defaultPageSize,
    })
  }

  generateItemsListColumns() {
    const _addrs = this.state ? this.state.addresses : []
    const _coin = this.props.coin

    let columns = [{
      id: 'type',
      Header: translate('INDEX.TYPE'),
      Footer: translate('INDEX.TYPE'),
      sortMethod: this.defaultSorting,
      accessor: (addr) => AddressTypeRender.call(this, addr),
    },
    {
      id: 'address',
      Header: translate('INDEX.ADDRESS'),
      Footer: translate('INDEX.ADDRESS'),
      sortMethod: this.defaultSorting,
      accessor: (addr) => AddressRender.call(this, addr),
    },
    {
      id: 'amount',
      Header: translate('INDEX.AMOUNT'),
      Footer: translate('INDEX.AMOUNT'),
      sortMethod: this.defaultSorting,
      accessor: (addr) => AddressAmountRender.call(this, addr),
    }];

    if (isPbaasChain(_coin)) {
      columns.push({
        id: 'reserve_amount',
        Header: translate('PBAAS.RESERVE_AMOUNT'),
        Footer: translate('PBAAS.RESERVE_AMOUNT'),
        sortMethod: this.defaultSorting,
        accessor: (addr) => AddressReserveAmountRender.call(this, addr),
      })
    }

    if (_addrs.length <= BOTTOM_BAR_DISPLAY_THRESHOLD) {
      return columns.map((column, index) => {
        delete column.Footer
        return column
      })
    } else {
      return columns
    }
  }

  renderAddressList() { 
    if (this.state.addresses.length) {
      return (
        //<DoubleScrollbar>
        <div className="address-table-container">
          { AddressListRender.call(this) }
        </div>
        //</DoubleScrollbar>
      );
    } else {
      return (
        <div className="text-center">{ translate('INDEX.NO_ADDRESSES') }</div>
      );
    }
  }

  render() {
    return (this.props ? ReceiveCoinRender.call(this) : null)
  }
}

const mapStateToProps = (state, props) => {
  let _mappedProps = {
    coin: state.ActiveCoin.coin,
    mode: state.ActiveCoin.mode,
    receive: state.ActiveCoin.receive,
    balance: state.ActiveCoin.balance,
    cache: state.ActiveCoin.cache,
    activeSection: state.ActiveCoin.activeSection,
    activeAddress: state.ActiveCoin.activeAddress,
    addresses: state.ActiveCoin.addresses,
    electrumCoins: state.Dashboard.electrumCoins,
    ethereumCoins: state.Dashboard.ethereumCoins,
  };

  if (props &&
      props.activeSection &&
      props.renderTableOnly) {
    _mappedProps.activeSection = props.activeSection;
    _mappedProps.renderTableOnly = props.renderTableOnly;
  }

  return _mappedProps;
};

export default connect(mapStateToProps)(ReceiveCoin);