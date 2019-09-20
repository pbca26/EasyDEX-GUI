import React from 'react'
import {
  isKomodoCoin
} from 'agama-wallet-lib/src/coin-helpers';
import translate from '../../../../translate/translate';
import { isPbaasChain } from '../../../../util/pbaas/pbaasChainUtils'
import Config from '../../../../config';
import ReactTooltip from 'react-tooltip';
import { fromSats } from 'agama-wallet-lib/src/utils';
import { PBAAS_ROOT_CHAIN } from '../../../../util/pbaas/pbaasConstants'

const pbaasSendFormRender = (self) => {
  const _coin = self.props.ActiveCoin.coin;
  const _mode = self.props.ActiveCoin.mode;
  const _isReserveChain = isPbaasChain(self.props.ActiveCoin.coin)
  const _chainStatus = self.state.connectedChainStatus
  const _isPreconvert = _chainStatus ? 
                            (_chainStatus.state === 'FULLY_FUNDED' || 
                            _chainStatus.state === 'PRE_CONVERT')
                            :
                            null
  const _price = _coin === PBAAS_ROOT_CHAIN ? 
    self.state.connectedChain ? 
      (self.state.connectedChain.hasOwnProperty('bestcurrencystate') ? 
        self.state.connectedChain.bestcurrencystate.priceinreserve 
        : 
        0)
      : 
      0
    :
    self.props.ActiveCoin.walletinfo.price_in_reserve
  const _launchfee = self.state.connectedChain ? self.state.connectedChain.launchfee : 0
  
  return (
  <div className="row">
    <div className="col-xlg-12 form-group form-material">
      {/*{ self.props.AddressBook &&
        self.props.AddressBook.arr &&
        typeof self.props.AddressBook.arr === 'object' &&
        self.props.AddressBook.arr[isKomodoCoin(_coin) ? 'KMD' : _coin] &&
        self.renderAddressBookDropdown(true) > 0 &&
        <button
        type="button"
        className="btn btn-default btn-send-address-book-dropdown"
        onClick={ self.toggleAddressBookDropdown }>
        { translate('SETTINGS.ADDRESS_BOOK') } <i className="icon fa-angle-down"></i>
        </button>
      }
      { self.state.addressBookSelectorOpen &&
        <div className="coin-tile-context-menu coin-tile-context-menu--address-book">
          <ul>
            { self.renderAddressBookDropdown() }
          </ul>
        </div>
      }*/}
      <label
        className="control-label"
        htmlFor="kmdWalletSendTo">
        { translate('INDEX.SEND_TO') }
      </label>
      <input
        type="text"
        className={ 'form-control' + (self.props.AddressBook && self.props.AddressBook.arr && typeof self.props.AddressBook.arr === 'object' && self.props.AddressBook.arr[isKomodoCoin(_coin) ? 'KMD' : _coin] ? ' send-to-padding-right' : '') }
        name="sendTo"
        onChange={ self.updateInput }
        value={ self.state.sendTo }
        disabled={ self.props.initState }
        id="kmdWalletSendTo"
        placeholder={ self.state.sendOffChain || self.state.sendVrscToken || self.state.convertAmount ? 
                      translate('SEND.ENTER_T_ADDR')
                        :
                      translate('SEND.ENTER_T_OR_Z_ADDR') }
        autoComplete="off"
        required />
      <span className="pointer">
        <label className="switch margin-top-10">
        <input
          type="checkbox"
          checked={ self.state.sendOffChain }
          readOnly />
        <div
          className="slider"
          onClick={ () => self.toggleSendOffChain() }></div>
        </label>
        <div
        className="toggle-label"
        onClick={ () => self.toggleSendOffChain() }>
        { translate('SEND.SEND_OFF_CHAIN' + (_isReserveChain ? '_TO_VRSC' : '')) }
        </div>
      </span>
    </div>
    { !_isReserveChain && self.state.sendOffChain &&
      <div className="col-lg-12 form-group form-material">
        { !self.props.initState &&
          <button
            type="button"
            className="btn btn-default btn-send-self color-done"
            onClick={ self.findChain }>
            { translate('PBAAS.CONNECT') }
          </button>
        }
        <label
          className="control-label"
          htmlFor="pbaasSendToChain">
          { translate('SEND.SEND_TO_CHAIN') }
        </label>
        <input
          type="text"
          className="form-control"
          name="sendToChain"
          value={ self.state.sendToChain }
          onChange={ self.updateInput }
          disabled={ self.state.loading }
          id="pbaasSendToChain"
          placeholder={ translate('SEND.SEND_TO_CHAIN_HOLDER') }
          autoComplete="off" />
      </div>
    }
    {((self.state.connectedChain && self.state.sendOffChain) || _isReserveChain) &&
      <React.Fragment>
        <label
          className="col-lg-12 control-label form-group form-material"
          htmlFor="pbaasSendToChain">
          { translate('SEND.RECENT_PRICE_X', 
          `${self.state.connectedChain && !_isReserveChain ? 
            (self.state.connectedChain.hasOwnProperty('bestcurrencystate') ? 
              self.state.connectedChain.bestcurrencystate.priceinreserve 
              : 
              0)
            :
            self.props.ActiveCoin.walletinfo.price_in_reserve
          } ${PBAAS_ROOT_CHAIN}/${
            self.state.connectedChain && !_isReserveChain ? 
                self.state.connectedChain.name 
              : 
                _coin}`) }
        </label>
        <label
          className="col-lg-12 control-label form-group form-material"
          htmlFor="pbaasSendToChain">
            { `${translate('PBAAS.RETURN_BASED_ON_RECENT_PRICE')}: `}
            { self.state.amount && !isNaN(Number(self.state.amount)) && Number(self.state.amount) > 0 ?
            ((Number(self.state.amount) - (Number(self.state.amount) * (_isPreconvert ? fromSats(_launchfee) : 0))) * (
              _coin === PBAAS_ROOT_CHAIN || self.state.sendVrscToken ? 
                _price > 0 ? 
                  _price 
                  : 
                  0
                :
                1/_price)).toFixed(8)
            : 
            '-'}
            {' '}
            { _coin === PBAAS_ROOT_CHAIN ? 
              self.state.connectedChain.name 
              : 
              self.state.sendVrscToken ? 
                _coin
                :
                'Verus Reserve Token' }
            <span>
              <i
                className="icon fa-question-circle settings-help"
                data-html={ true }
                data-for="estReturn"
                data-tip={ translate('PBAAS.RETURN_BASED_ON_RECENT_PRICE_DESC') }></i>
              <ReactTooltip
                id="estReturn"
                effect="solid"
                className="text-left" 
                place="right" />
            </span>
          </label>
        </React.Fragment>
    }
    { _chainStatus &&
      <label
      className="col-lg-12 control-label form-group form-material"
      htmlFor="pbaasSendToChain">
        { `${translate('PBAAS.X_CHAIN_STATUS', `${self.state.connectedChain.name}`)} `}
        { _chainStatus.icon }
        {!_chainStatus.openForSend && _chainStatus.state !== 'SYNCING' &&
          <span>
            <i
              className="icon fa-warning send-warning margin-right-5"
              data-html={ true }
              data-for="cantSendWarning"
              data-tip={ translate('PBAAS.CANT_SEND_DESC') }></i>
            <ReactTooltip
              id="cantSendWarning"
              effect="solid"
              className="text-left" 
              place="right" />
          </span>
        }
        <span>
          <i
            className="icon fa-question-circle settings-help"
            data-html={ true }
            data-for="chainState"
            data-tip={ translate(`PBAAS.${_chainStatus.state}_DESC`, _chainStatus.startblock) }></i>
          <ReactTooltip
            id="chainState"
            effect="solid"
            className="text-left" 
            place="right" />
        </span>
      </label>
    }
    { _chainStatus &&
    (_chainStatus.state === 'PRE_CONVERT' || _chainStatus.state === 'PRE_LAUNCH' || _chainStatus.state === 'FULLY_FUNDED') && 
      <React.Fragment>
        <label
        className="col-lg-12 control-label form-group form-material"
        htmlFor="pbaasSendToChain">
          { `${translate('PBAAS.LAUNCH_HEIGHT', PBAAS_ROOT_CHAIN)}: `}
          { Math.abs(_chainStatus.age) }
        </label>
        {_isPreconvert && <label
        className="col-lg-12 control-label form-group form-material"
        htmlFor="pbaasSendToChain">
          { `${translate('PBAAS.LAUNCH_FEE')}: `}
          { `${(fromSats(_launchfee) * 100).toFixed(2)}%`  }
          <span>
            <i
              className="icon fa-question-circle settings-help"
              data-html={ true }
              data-for="launchFeeDesc"
              data-tip={ translate('PBAAS.LAUNCH_FEE_DESC') }></i>
            <ReactTooltip
              id="launchFeeDesc"
              effect="solid"
              className="text-left" 
              place="right" />
          </span>
        </label>}
      </React.Fragment>
    }
    <div className="col-lg-12 form-group form-material">
      {/* !self.props.initState &&
        <button
          type="button"
          className="btn btn-default btn-send-self"
          onClick={ self.setSendAmountAll }>
          { translate('SEND.ALL') }
        </button>
      */}
      <label
        className="control-label"
        htmlFor="kmdWalletAmount">
        { translate('INDEX.AMOUNT') }
      </label>
      <input
        type="text"
        className="form-control"
        name="amount"
        value={ self.state.amount !== 0 ? self.state.amount : '' }
        onChange={ self.updateInput }
        disabled={ self.props.initState }
        id="kmdWalletAmount"
        placeholder={ translate('SEND.ENTER_AMOUNT') }
        autoComplete="off" />
      { (
        (self.state.sendOffChain && !_isReserveChain && self.state.connectedChain && self.state.connectedChain.name) 
        || (_isReserveChain && !self.state.sendOffChain)) && !_isPreconvert &&
        <span className="pointer">
          <label className="switch margin-top-10">
          <input
            type="checkbox"
            checked={ self.state.convertAmount }
            readOnly />
          <div
            className="slider"
            onClick={ () => self.toggleConvertAmount() }></div>
          </label>
          <div
          className="toggle-label"
          onClick={ () => self.toggleConvertAmount() }>
          { translate('SEND.CONVERT_AMOUNT_TO_X', 
            _isReserveChain ? 
              (self.state.sendVrscToken ? 
                self.props.ActiveCoin.coin
                  :
                'Verus Reserve Token')
              : 
            (self.state.connectedChain && self.state.connectedChain.name ? self.state.connectedChain.name : '')
          ) }
          </div>
        </span>
      }
    </div>
    { (self.props.ActiveCoin.coin === 'VRSC' || 
      self.props.ActiveCoin.coin === 'VRSCTEST' ||
      _isReserveChain) && 
      (self.state.sendTo.length === 95 || self.state.sendTo.length === 78) && 
      !self.state.sendOffChain &&
      <div className="col-lg-12 form-group form-material">
        <label
        className="control-label"
        htmlFor="kmdWalletMemo">
        { translate('SEND.PRIVATE_MESSAGE') }
        </label>
        <input
        type="text"
        className="form-control"
        name="memo"
        value={ self.state.memo !== '' ? self.state.memo : '' }
        onChange={ self.updateInput }
        id="kmdWalletMemo"
        placeholder={ translate('SEND.PRIVATE_MESSAGE_DESC') }
        autoComplete="off" />
      </div>
    }
    {/* _mode === 'native' && self.state.sendFrom &&
      <div className="row">
        <div className="col-lg-12 form-group form-material">
        <button
          type="button"
          className="btn btn-default btn-send-zfee-dropdown margin-left-15"
          onClick={ self.toggleZtxDropdown }>
          { translate('SEND.INCLUDE_NON_STANDARD_FEE')} { self.state.ztxFee === 0.0001 ? translate('SEND.INCLUDE_NON_STANDARD_FEE_DEFAULT') : self.state.ztxFee } <i className="icon fa-angle-down"></i>
        </button>
        </div>
        <div className="col-lg-12 form-group form-material">
        { self.state.ztxSelectorOpen &&
          <div className="coin-tile-context-menu coin-tile-context-menu--zfee">
          <ul>
            { self.renderZtxDropdown() }
          </ul>
          </div>
        }
        </div>
      </div>
    */}
    { (!self.isFullySynced() || !navigator.onLine) &&
    self.props.ActiveCoin &&
    _mode === 'native' &&
      <div className="col-lg-12 padding-top-20 padding-bottom-20 send-coin-sync-warning">
        <i className="icon fa-warning color-warning margin-right-5"></i>&nbsp;
        <span className="desc">{ translate('SEND.SEND_NATIVE_SYNC_WARNING') }</span>
      </div>
    }
    <div className="col-lg-12">
    <button
      type="button"
      className="btn btn-primary waves-effect waves-light pull-right"
      onClick={ self.props.renderFormOnly ? self.handleSubmit : () => self.changeSendCoinStep(1) }
      disabled={!self.state.sendTo ||
      !self.state.amount ||
      (self.props.ActiveCoin && self.props.ActiveCoin.balance && 
        self.props.ActiveCoin.balance.interest > 0 && !self.state.donateInterest) ||
      (!_isReserveChain && self.state.sendOffChain && !self.state.connectedChain) ||
      self.state.loading}>
      { (self.state.convertAmount ? 
        translate('SEND.CONVERT_AND_SEND') 
          : 
        translate('SEND.SEND')) } { self.state.amount } { self.state.sendVrscToken ? 'VRSC Token' : _coin } { 
          self.state.sendOffChain && self.state.connectedChain && self.state.connectedChain.name ? translate('SEND.TO_X_CHAIN', self.state.connectedChain.name) : ''}
    </button>
    </div>
  </div>
  )
}

export default pbaasSendFormRender