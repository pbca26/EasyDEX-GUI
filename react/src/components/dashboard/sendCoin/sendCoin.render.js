import React from 'react';
import translate from '../../../translate/translate';
import QRModal from '../qrModal/qrModal';
import ReactTooltip from 'react-tooltip';
import {
  formatValue,
  isPositiveNumber,
  fromSats,
  toSats,
} from 'agama-wallet-lib/src/utils';
import {
  explorerList,
  isKomodoCoin,
} from 'agama-wallet-lib/src/coin-helpers';
import Config from '../../../config';
import mainWindow, { staticVar } from '../../../util/mainWindow';
import { formatEther } from 'ethers/utils/units';
import coinFees from 'agama-wallet-lib/src/fees';
import erc20ContractId from 'agama-wallet-lib/src/eth-erc20-contract-id';
import defaultSendFormRender from './sendCoinForms/defaultSendForm.render'
import kvSendFormRender from './sendCoinForms/kvSendForm.render'
import shieldCoinbaseFormRender from './sendCoinForms/shieldCoinbaseForm.render'
import pbaasSendFormRender from './sendCoinForms/pbaasSendForm.render'
import { isPbaasChain } from '../../../util/pbaasUtil';

const _feeLookup = {
  eth: [
    'fast',
    'average',
    'slow',
  ],
};

const kvCoins = {
  'KV': true,
  'BEER': true,
  'PIZZA': true,
};

const PBAAS_ROOT_CHAIN = Config.verus.pbaasTestmode ? 'VRSCTEST' : 'VRSC'

export const ZmergeToAddressRender = function() {
  return (
    <div className="zmergetoaddress">
      zmergetoaddress ui here
    </div>
  );
}

/**
 * Render function for address list dropdown on send screen.
 * 
 * @param {Boolean} includePrivate (Optional, defaults to true) Include private (z) addresses in dropdown list.
 */
export const AddressListRender = function(includePrivate = true) {
  const _coin = this.props.ActiveCoin.coin;
  const _mode = this.props.ActiveCoin.mode;
  const _acPrivate = staticVar.chainParams && staticVar.chainParams[_coin] && staticVar.chainParams[_coin].ac_private;
  
  return (
    <div className={ `btn-group bootstrap-select form-control form-material showkmdwalletaddrs show-tick ${(this.state.addressSelectorOpen ? 'open' : '')}` }>
      <button
        type="button"
        className={ 'btn dropdown-toggle btn-info' + (_mode === 'spv' || _mode === 'eth' ? ' disabled' : '') }
        onClick={ this.openDropMenu }>
        <span className="filter-option pull-left">{ this.renderSelectorCurrentLabel() }&nbsp;</span>
        <span className="bs-caret">
          <span className="caret"></span>
        </span>
      </button>
      <div className="dropdown-menu open">
        <ul className="dropdown-menu inner">
          { (_mode === 'spv' ||
             _mode === 'eth' ||
            (_mode === 'native' && _coin !== 'KMD' && !_acPrivate)) &&
            (!this.state.sendTo || (this.state.sendTo && this.state.sendTo.substring(0, 2) !== 'zc' && this.state.sendTo.substring(0, 2) !== 'zs' && this.state.sendTo.length !== 95)) &&
            <li
              className="selected"
              onClick={ () => this.updateAddressSelection(null, 'public', null) }>
              <a>
                <span className="text">
                  { _mode === 'spv' &&
                    <span>{ `[ ${this.props.ActiveCoin.balance.balance + (this.props.ActiveCoin.balance.unconfirmed || 0)} ${_coin} ] ${this.props.Dashboard.electrumCoins[_coin].pub}` }</span>
                  }
                  { _mode === 'eth' &&
                    <span>{ `[ ${this.props.ActiveCoin.balance.balance} ${_coin} ] ${this.props.Dashboard.ethereumCoins[_coin].pub}` }</span>
                  }
                  { _mode == 'native' &&
                    <span>{ translate('INDEX.T_FUNDS') }</span>
                  }
                </span>
                <span
                  className="glyphicon glyphicon-ok check-mark pull-right"
                  style={{ display: this.state.sendFrom === null ? 'inline-block' : 'none' }}></span>
              </a>
            </li>
          }
          { (_mode === 'spv' ||
             _mode === 'eth' ||
             ((_mode === 'native' && _coin === 'KMD') || (_mode === 'native' && _coin !== 'KMD' && !_acPrivate))) &&
            this.renderAddressByType('public')
          }
          { includePrivate ? this.renderAddressByType('private') : null }
        </ul>
      </div>
    </div>
  );
};

export const AddressListRenderShieldCoinbase = function() {
  return (
    <div className={ `btn-group bootstrap-select form-control form-material showkmdwalletaddrs show-tick ${(this.state.addressSelectorOpen ? 'open' : '')}` }>
      <button
        type="button"
        className="btn dropdown-toggle btn-info"
        onClick={ this.openDropMenu }>
        <span className="filter-option pull-left">{ this.renderSelectorCurrentLabel() }&nbsp;</span>
        <span className="bs-caret">
          <span className="caret"></span>
        </span>
      </button>
      <div className="dropdown-menu open">
        <ul className="dropdown-menu inner">
          { this.renderAddressByType('private', 'shieldCoinbase') }
        </ul>
      </div>
    </div>
  );
};

export const _SendFormRender = function() {
  const _coin = this.props.ActiveCoin.coin;
  const _mode = this.props.ActiveCoin.mode;
  const _isAcPrivate = staticVar.chainParams && staticVar.chainParams[_coin] && staticVar.chainParams[_coin].ac_private;
  const _isReserveChain = isPbaasChain(this.props.ActiveCoin.coin)
  const _chainStatus = this.state.connectedChainStatus
  const _isPreconvert = _chainStatus ? 
                            (_chainStatus.state === 'FULLY_FUNDED' || 
                            _chainStatus.state === 'PRE_CONVERT')
                            :
                            null

  return (
    <div className="extcoin-send-form">
      {_isReserveChain && !this.state.sendOffChain &&/* has vrsc token balance &&*/ 
      <span className="pointer">
          <label className="switch">
          <input
            type="checkbox"
            checked={ this.state.sendVrscToken }
            readOnly />
          <div
            className="slider"
            onClick={ () => this.toggleSendVrscToken() }></div>
          </label>
          <div
          className="toggle-label"
          onClick={ () => this.toggleSendVrscToken() }>
          { translate( 'SEND.SEND_VRSC_TOKEN' ) }
          </div>
      </span>}
      { (this.state.renderAddressDropdown ||
        (_mode === 'native' && _coin !== 'KMD' && _isAcPrivate)) &&
        !this.state.zshieldcoinbaseToggled &&
        ((!this.state.sendVrscToken && !this.state.sendOffChain && !this.state.convertAmount) || _isPreconvert) &&
        <div className="row">
          <div className="col-xlg-12 form-group form-material">
            <label className="control-label padding-bottom-10">
              { _isPreconvert ? translate('PBAAS.REFUND_ADDRESS') : translate('INDEX.SEND_FROM') }
              { _isPreconvert &&
                <span>
                  <i
                    className="icon fa-question-circle settings-help"
                    data-html={ true }
                    data-for="refundAddr"
                    data-tip={ translate('PBAAS.REFUND_ADDRESS_DESC') }></i>
                  <ReactTooltip
                    id="refundAddr"
                    effect="solid"
                    className="text-left" 
                    place="right" />
                </span>
              }
            </label>
            { this.renderAddressList(_isPreconvert ? false : true) }
          </div>
        </div>
      }
      { !this.state.kvSend &&
        !this.state.zshieldcoinbaseToggled &&
        !(_isReserveChain || /*this.props.ActiveCoin.coin === 'VRSC' || */this.props.ActiveCoin.coin === 'VRSCTEST') &&
        defaultSendFormRender(this)
      }
      { this.state.kvSend &&
        !(_isReserveChain || this.props.ActiveCoin.coin === 'VRSC' || this.props.ActiveCoin.coin === 'VRSCTEST') &&
        kvSendFormRender(this)
      }
      { this.state.zshieldcoinbaseToggled &&
        shieldCoinbaseFormRender(this)
      }
      { (_isReserveChain || /* this.props.ActiveCoin.coin === 'VRSC' || */ this.props.ActiveCoin.coin === 'VRSCTEST') &&
        pbaasSendFormRender(this)
      }
    </div>
  );
}

export const SendRender = function() {
  const _coin = this.props.ActiveCoin.coin;
  const _mode = this.props.ActiveCoin.mode;
  const amountChanged = 
    (this.state.spvPreflightRes && 
    this.state.spvPreflightRes.value && 
    fromSats(this.state.spvPreflightRes.value) !== Number(this.state.amount))
  const _hasZAddrs = this.props.ActiveCoin.mode === 'native' && this.props.ActiveCoin.addresses.private && this.props.ActiveCoin.addresses.private.length > 0
  const _chainStatus = this.state.connectedChainStatus
  const _isReserveChain = isPbaasChain(this.props.ActiveCoin.coin)
  const _isPreconvert = _chainStatus ? 
                            (_chainStatus.state === 'FULLY_FUNDED' || 
                            _chainStatus.state === 'PRE_CONVERT')
                            :
                            null
  const _price = _coin === PBAAS_ROOT_CHAIN ? 
    this.state.connectedChain ? 
      (this.state.connectedChain.hasOwnProperty('bestcurrencystate') ? 
        this.state.connectedChain.bestcurrencystate.priceinreserve 
        : 
        0)
      : 
      0
    :
    this.props.ActiveCoin.walletinfo.price_in_reserve
  const _launchfee = this.state.connectedChain ? this.state.connectedChain.launchfee : 0

  if (this.props.renderFormOnly) {
    return (
      <div>{ this.SendFormRender() }</div>
    );
  } else {
    return (
      <div className="col-sm-12 padding-top-10 coin-send-form">
        <div className="col-xlg-12 col-md-12 col-sm-12 col-xs-12">
          <div className="steps row margin-top-10">
            <div className={ 'step col-md-4' + (this.state.currentStep === 0 ? ' current' : '') }>
              <span className="step-number">1</span>
              <div className="step-desc">
                <span className="step-title">{ translate('INDEX.FILL_SEND_FORM') }</span>
                <p>{ translate('INDEX.FILL_SEND_DETAILS') }</p>
              </div>
            </div>
            <div className={ 'step col-md-4' + (this.state.currentStep === 1 ? ' current' : '') }>
              <span className="step-number">2</span>
              <div className="step-desc">
                <span className="step-title">{ translate('INDEX.CONFIRMING') }</span>
                <p>{ translate('INDEX.CONFIRM_DETAILS') }</p>
              </div>
            </div>
            <div className={ 'step col-md-4' + (this.state.currentStep === 2 ? ' current' : '') }>
              <span className="step-number">3</span>
              <div className="step-desc">
                <span className="step-title">{ translate('INDEX.PROCESSING_TX') }</span>
                <p>{ translate('INDEX.PROCESSING_DETAILS') }</p>
              </div>
            </div>
          </div>
        </div>

        { this.state.currentStep === 0 &&
          <div className="col-xlg-12 col-md-12 col-sm-12 col-xs-12">
            <div className="panel">
              <div className="panel-heading">
                { !this.state.zshieldcoinbaseToggled &&
                  <h3 className="panel-title">
                    { translate('INDEX.SEND') } { _coin }
                  </h3>
                }
                { this.state.zshieldcoinbaseToggled &&
                  <h3 className="panel-title">
                    { translate('SEND.SHIELD_COINBASE') } { _coin }
                  </h3>
                }
                { this.props.ActiveCoin.coin === 'VRSC' &&
                  this.props.ActiveCoin.mode === 'native' &&
                  <div className="padding-left-30 padding-top-20">
                    <button
                      type="button"
                      className="btn btn-default"
                      disabled={!_hasZAddrs}
                      data-tip={ !_hasZAddrs ? translate('SEND.CREATE_Z_ADDR_TO_SHIELD') : null }
                      data-html={ !_hasZAddrs ? true : false}
                      data-for={ !_hasZAddrs ? "zAddrNeeded": null }
                      onClick={ this.zshieldcoinbaseToggle }>
                      { this.state.zshieldcoinbaseToggled ? translate('INDEX.BACK') : translate('SEND.SHIELD_COINBASE') }
                    </button>
                    <ReactTooltip
                      id="zAddrNeeded"
                      effect="solid"
                      className="text-left" />
                  </div>
                }
                { ((_mode === 'spv' && Config.experimentalFeatures && kvCoins[_coin]) ||
                  (_mode === 'spv' && Config.coinControl)) &&
                  <div className="kv-select-block">
                    { _mode === 'spv' &&
                      Config.experimentalFeatures &&
                      kvCoins[_coin] &&
                      <span>
                        <button
                          type="button"
                          className={ 'btn btn-default' + (this.state.kvSend ? ' active' : '') }
                          onClick={ this.toggleKvSend }>
                          { translate('KV.SEND_KV') }
                        </button>
                        <button
                          type="button"
                          className={ 'btn btn-default margin-left-10' + (!this.state.kvSend ? ' active' : '') }
                          onClick={ this.toggleKvSend }>
                          { translate('KV.SEND_TX') }
                        </button>
                      </span>
                    }
                    { _mode === 'spv' &&
                      Config.coinControl &&
                      <button
                        type="button"
                        className={ 'btn btn-default margin-left-10' + (!this.state.kvSend ? ' active' : '') }
                        onClick={ this.toggleKvSend }>
                        { translate('SEND.COIN_CONTROL') }
                      </button>
                    }
                  </div>
                }
              </div>
              <div className="qr-modal-send-block">
                { !this.props.initState &&
                  <QRModal
                    mode="scan"
                    setRecieverFromScan={ this.setRecieverFromScan } />
                }
              </div>
              <div className="padding-left-30 padding-top-20 hide">
                <span className="pointer">
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={ this.state.enableZmergetoaddress }
                      readOnly />
                    <div
                      className="slider"
                      onClick={ () => this.toggleZmergetoaddress() }></div>
                  </label>
                  <div
                    className="toggle-label"
                    onClick={ () => this.toggleZmergetoaddress() }>
                    { translate('SEND.USE_ZMERGETOADDRESS') }
                  </div>
                </span>
              </div>
              { /*this.enableZmergetoaddress &&
                this.renderZmergeToAddress()*/ }
              <div className="panel-body container-fluid">
              { this.SendFormRender() }
              </div>
            </div>
          </div>
        }

        { this.state.currentStep === 1 &&
          <div className="col-xlg-12 col-md-12 col-sm-12 col-xs-12">
            <div className="panel">
              <div className="panel-body">
                <div className="row">
                  <div className="col-xs-12">
                    <strong>{ translate('INDEX.TO') }</strong>
                  </div>
                  <div className="col-lg-6 col-sm-6 col-xs-12 word-break--all">{ this.state.sendTo }</div>
                  <div
                    className={"col-lg-6 col-sm-6 col-xs-6" + 
                    (amountChanged ? " color-warning bold" : "")}>
                    <span
                      data-tip={ amountChanged ? translate('DASHBOARD.AMOUNT_CHANGED_DESC') : null }
                      data-html={ amountChanged ? true : false}
                      data-for={ amountChanged ? "sendAmountChanged": null }>
                    { amountChanged ?
                      fromSats(this.state.spvPreflightRes.value) : this.state.amount } { _coin }
                    </span>
                  </div>
                  <ReactTooltip
                    id="sendAmountChangedValue"
                    effect="solid"
                    className="text-left" />
                  { amountChanged &&
                    <div>
                      <div className="col-lg-6 col-sm-6 col-xs-12 padding-top-10 bold">
                        <span 
                        className="color-warning"
                        data-tip={ translate('DASHBOARD.AMOUNT_CHANGED_DESC') }
                        data-html={ true }
                        data-for="sendAmountChanged">
                          <i className="icon fa-warning color-warning"/>
                          { ' ' + translate('DASHBOARD.AMOUNT_CHANGED', this.state.amount, fromSats(this.state.spvPreflightRes.value)) }
                        </span>
                      </div>
                      <ReactTooltip
                      id="sendAmountChanged"
                      effect="solid"
                      className="text-left" />
                    </div>
                  }
                  { this.state.subtractFee &&
                    <div className="col-lg-6 col-sm-6 col-xs-12 padding-top-10 bold">
                      { translate('DASHBOARD.SUBTRACT_FEE') }
                    </div>
                  }
                </div>

                { this.state.sendFrom &&
                  <div className="row padding-top-20">
                    <div className="col-xs-12">
                      <strong>{ _isPreconvert ? translate('PBAAS.REFUND_ADDRESS') : translate('INDEX.FROM') }</strong>
                    </div>
                    <div className="col-lg-6 col-sm-6 col-xs-12 word-break--all">{ this.state.sendFrom }</div>
                    {!_isPreconvert && 
                    <div className="col-lg-6 col-sm-6 col-xs-6 confirm-currency-send-container">
                      { Number(this.state.amount) } { _coin }
                    </div>}
                  </div>
                }
                { (this.state.sendOffChain || this.state.sendVrscToken || this.state.convertAmount) &&
                  <React.Fragment>
                    { this.state.sendToChain && this.state.sendToChain.length > 0 &&
                      <React.Fragment>
                        <div className="row padding-top-20">
                          <div className="col-xs-12">
                            <strong>{ `${translate('SEND.ORIGIN_CHAIN')}:` }</strong>
                          </div>
                          <div
                            className={"col-lg-6 col-sm-6 col-xs-6"}>
                            <span>
                            { _coin }
                            </span>
                          </div>
                        </div>
                        <div className="row padding-top-20">
                          <div className="col-xs-12">
                            <strong>{ `${translate('SEND.DESTINATION_CHAIN')}:` }</strong>
                          </div>
                          <div
                            className={"col-lg-6 col-sm-6 col-xs-6"}>
                            <span>
                            { this.state.sendToChain }
                            </span>
                          </div>
                        </div>
                      </React.Fragment>
                    }
                    { ((this.state.sendToChain && this.state.sendToChain.length > 0) || (this.state.sendVrscToken) || (this.state.convertAmount)) &&
                      <React.Fragment>
                        <div className="row padding-top-20">
                          <div className="col-xs-12">
                            <strong>{ `${translate('SEND.FROM_COIN')}:` }</strong>
                          </div>
                          <div
                            className={"col-lg-6 col-sm-6 col-xs-6"}>
                            <span>
                            { this.state.sendVrscToken ? 'Verus Reserve Token' : _coin }
                            </span>
                          </div>
                        </div>
                        <div className="row padding-top-20">
                          <div className="col-xs-12">
                            <strong>{ `${translate('SEND.TO_COIN')}:` }</strong>
                          </div>
                          <div
                            className={"col-lg-6 col-sm-6 col-xs-6"}>
                            <span>
                            { this.state.convertAmount ? 
                                (this.state.sendToChain && this.state.sendToChain.length > 0) ? 
                                  this.state.sendToChain
                                  :
                                  this.state.sendVrscToken ? 
                                    _coin
                                    :
                                    'Verus Reserve Token'
                                :
                                this.state.sendVrscToken ? 
                                  this.state.sendOffChain ? 
                                    PBAAS_ROOT_CHAIN
                                    :
                                    'Verus Reserve Token'
                                  :
                                  (this.state.sendOffChain ? 
                                  'Verus Reserve Token'
                                  :
                                  _coin)
                             }
                            </span>
                          </div>
                        </div>
                      </React.Fragment>
                    }
                    { this.state.convertAmount || _isPreconvert &&
                      <React.Fragment>
                        <div className="row padding-top-20">
                          <div className="col-xs-12">
                            <strong>{ `${translate('SEND.RECENT_PRICE')}:` }</strong>
                          </div>
                          <div
                            className={"col-lg-6 col-sm-6 col-xs-6"}>
                            <span>
                              {`${this.state.connectedChain && !_isReserveChain ? 
                                (this.state.connectedChain.hasOwnProperty('bestcurrencystate') ? 
                                  this.state.connectedChain.bestcurrencystate.priceinreserve 
                                  : 
                                  0)
                                :
                                this.props.ActiveCoin.walletinfo.price_in_reserve
                              } ${ PBAAS_ROOT_CHAIN }/${
                                this.state.connectedChain && !_isReserveChain ? 
                                    this.state.connectedChain.name 
                                  : 
                                    _coin}`}
                            </span>
                          </div>
                        </div>
                        {_isPreconvert && 
                        <div className="row padding-top-20">
                          <div className="col-xs-12">
                            <strong>{ `${translate('PBAAS.LAUNCH_FEE')}:` }</strong>
                          </div>
                          <div
                            className={"col-lg-6 col-sm-6 col-xs-6"}>
                            <span>
                              { this.state.connectedChain ? `${(fromSats(this.state.connectedChain.launchfee) * 100).toFixed(2)}%` : '' }
                            </span>
                          </div>
                        </div>}
                        <div className="row padding-top-20">
                          <div className="col-xs-12">
                            <strong>{ `${translate('PBAAS.RETURN_BASED_ON_RECENT_PRICE')}:` }</strong>
                          </div>
                          <div
                            className={"col-lg-6 col-sm-6 col-xs-6"}>
                            <span>
                            { this.state.amount && !isNaN(Number(this.state.amount)) && Number(this.state.amount) > 0 ?
                            ((Number(this.state.amount) - (Number(this.state.amount) * (_isPreconvert ? fromSats(_launchfee) : 0))) * (
                              _coin === PBAAS_ROOT_CHAIN || this.state.sendVrscToken ? 
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
                                this.state.connectedChain.name 
                                : 
                                this.state.sendVrscToken ? 
                                  _coin
                                  :
                                  'Verus Reserve Token' }
                            </span>
                          </div>
                        </div>
                      </React.Fragment>
                    }
                  </React.Fragment>
                }
                { this.state.spvPreflightRes &&
                  <div className="row padding-top-20">
                    <div className="col-xs-12">
                      <strong>{ translate('SEND.FEE') }</strong>
                    </div>
                    <div className="col-lg-12 col-sm-12 col-xs-12">
                      { formatValue(fromSats(this.state.spvPreflightRes.fee)) } ({ this.state.spvPreflightRes.fee } { translate('SEND.SATS') })
                    </div>
                  </div>
                }
                { this.state.spvPreflightRes &&
                  <div className="row padding-top-20">
                    { this.state.spvPreflightRes.change === 0 &&
                      (formatValue((fromSats(this.state.spvPreflightRes.value)) - (fromSats(this.state.spvPreflightRes.fee))) > 0) &&
                      <div className="col-lg-12 col-sm-12 col-xs-12 padding-bottom-20">
                        <strong>{ translate('SEND.ADJUSTED_AMOUNT') }</strong>
                        <i
                          className="icon fa-question-circle settings-help send-btc"
                          data-for="sendCoin2"
                          data-tip={ translate('SEND.MAX_AVAIL_AMOUNT_TO_SPEND') }></i>
                        &nbsp;{ formatValue((fromSats(this.state.spvPreflightRes.value)) - (fromSats(this.state.spvPreflightRes.fee))) }
                      </div>
                    }
                    <ReactTooltip
                      id="sendCoin2"
                      effect="solid"
                      className="text-left" />
                    { this.state.spvPreflightRes.estimatedFee < 0 &&
                      <div className="col-lg-12 col-sm-12 col-xs-12 padding-bottom-20">
                        <strong>{ translate('SEND.KMD_INTEREST') }</strong>&nbsp;
                        { Math.abs(formatValue(fromSats(this.state.spvPreflightRes.estimatedFee))) } { translate('SEND.TO') } { this.props.Dashboard.electrumCoins[_coin].pub }
                      </div>
                    }
                    { this.state.spvPreflightRes.totalInterest > 0 &&
                      <div className="col-lg-12 col-sm-12 col-xs-12 padding-bottom-20">
                        <strong>{ translate('SEND.KMD_INTEREST') }</strong>&nbsp;
                        { Math.abs(formatValue(fromSats(this.state.spvPreflightRes.totalInterest))) } { translate('SEND.TO') } { this.props.Dashboard.electrumCoins[_coin].pub }
                      </div>
                    }
                    { this.state.spvPreflightRes.change >= 0 &&
                      <div className="col-lg-12 col-sm-12 col-xs-12">
                        <strong>{ translate('SEND.TOTAL_AMOUNT_DESC') }</strong>&nbsp;
                        { formatValue((fromSats(this.state.spvPreflightRes.value)) + fromSats((this.state.spvPreflightRes.fee))) }
                      </div>
                    }
                  </div>
                }
                { Config.requirePinToConfirmTx &&
                  mainWindow.pinAccess &&
                  <div className="row padding-top-30">
                    <div className="col-lg-12 col-sm-12 col-xs-12 form-group form-material">
                      <label
                        className="control-label bold"
                        htmlFor="pinNumber">
                        { translate('SEND.PIN_NUMBER') }
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        name="pin"
                        ref="pin"
                        value={ this.state.pin }
                        onChange={ this.updateInput }
                        id="pinNumber"
                        placeholder={ translate('SEND.ENTER_YOUR_PIN') }
                        autoComplete="off" />
                    </div>
                  </div>
                }
                { this.state.noUtxo &&
                  <div className="padding-top-20">{ translate('SEND.NO_VALID_UTXO_ERR') }</div>
                }
                { (this.state.spvPreflightSendInProgress || (erc20ContractId[_coin] && this.state.ethPreflightSendInProgress)) &&
                  <div className="padding-top-20">{ translate('SEND.SPV_VERIFYING') }...</div>
                }
                { this.state.spvVerificationWarning &&
                  <div className="padding-top-20 fs-15">
                    <strong className="color-warning">{ translate('SEND.WARNING') }:</strong>&nbsp;
                    { translate('SEND.WARNING_SPV_P1') }<br />
                    { translate('SEND.WARNING_SPV_P2') }
                  </div>
                }
                { !this.state.spvDpowVerificationWarning &&
                  <div className="padding-top-20 fs-15">
                    <strong>Notice:</strong>&nbsp;
                    One ore more of your UTXO(s) are not dPoW secured.
                  </div>
                }
                { this.state.spvDpowVerificationWarning &&
                  this.state.spvDpowVerificationWarning === true &&
                  <div className="padding-top-20 fs-15">
                    <i className="icon fa-shield col-green"></i>&nbsp;
                    Your funds are dPoW secured.
                  </div>
                }
                { _mode === 'eth' &&
                  erc20ContractId[_coin] &&
                  this.state.ethPreflightRes &&
                  this.state.ethPreflightRes.msg &&
                  this.state.ethPreflightRes.msg === 'error' &&
                  <div className="padding-top-10">
                    <div>Error cannot verify ERC20 transaction.</div>
                    <div className="padding-top-10 padding-bottom-10">Debug info</div>
                    <div className="word-break--all">{ JSON.stringify(this.state.ethPreflightRes.result) }</div>
                  </div>
                }
                { this.state.preflightError &&
                  <div className="padding-top-10 bold color-error">
                    <i className="icon fa-warning"/>
                    { ' ' + this.state.preflightError }
                  </div>
                }
                { _mode === 'eth' &&
                  ((erc20ContractId[_coin] && this.state.ethPreflightRes && !this.state.ethPreflightRes.msg) || !erc20ContractId[_coin]) &&
                  <div className="row">
                    <div className="col-lg-12 col-sm-12 col-xs-12 padding-top-20">
                      <span>
                        <strong>{ translate('SEND.FEE') }:</strong>&nbsp;
                        { !erc20ContractId[_coin] &&
                          <span>
                          { formatEther(this.state.ethFees[_feeLookup.eth[this.state.ethFeeType]] * coinFees[this.props.ActiveCoin.coin.toLowerCase()]) }&nbsp;
                          </span>
                        }
                        { erc20ContractId[_coin] &&
                          <span>
                          { this.state.ethPreflightRes.fee } ETH
                          </span>
                        }
                      </span>
                    </div>
                  </div>
                }
                { _mode === 'eth' &&
                  erc20ContractId[_coin] &&
                  this.state.ethPreflightRes &&
                  !this.state.ethPreflightRes.msg &&
                  <div>
                    { this.state.ethPreflightRes.notEnoughBalance &&
                      <div className="row">
                        <div className="col-lg-12 col-sm-12 col-xs-12 padding-top-20">
                        Not enough ETH to send the transaction
                        </div>
                      </div>
                    }
                    <div className="row">
                      <div className="col-lg-12 col-sm-12 col-xs-12 padding-top-20">
                      <strong>Current balance</strong>: { this.state.ethPreflightRes.maxBalance.balance } ETH
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-12 col-sm-12 col-xs-12 padding-top-20">
                      <strong>Balace after the fee</strong>: { this.state.ethPreflightRes.balanceAferFee } ETH
                      </div>
                    </div>
                  </div>
                }
                { _mode === 'eth' &&
                  !erc20ContractId[_coin] &&
                  <div className="row">
                    <div className="col-lg-12 col-sm-12 col-xs-12 padding-top-20">
                      <strong>{ translate('SEND.TOTAL_AMOUNT_DESC') }:</strong>&nbsp;
                      { Number(this.state.amount) + Number(formatEther(this.state.ethFees[_feeLookup.eth[this.state.ethFeeType]] * coinFees[this.props.ActiveCoin.coin.toLowerCase()])) > this.props.ActiveCoin.balance.balance ? Number(this.state.amount) - Number(formatEther(this.state.ethFees[_feeLookup.eth[this.state.ethFeeType]] * coinFees[this.props.ActiveCoin.coin.toLowerCase()])) : Number(this.state.amount) + Number(formatEther(this.state.ethFees[_feeLookup.eth[this.state.ethFeeType]] * coinFees[this.props.ActiveCoin.coin.toLowerCase()])) }&nbsp;
                      { _coin }
                    </div>
                  </div>
                }
                <div className="widget-body-footer">
                  <a
                    className="btn btn-default waves-effect waves-light"
                    onClick={ () => this.changeSendCoinStep(0, true) }>{ translate('INDEX.BACK') }</a>
                  <div className="widget-actions pull-right">
                    <button
                      type="button"
                      className="btn btn-primary"
                      disabled={
                        (_mode === 'eth' &&
                        erc20ContractId[_coin] &&
                        this.state.ethPreflightRes &&
                        ((this.state.ethPreflightRes.msg && this.state.ethPreflightRes.msg === 'error') || (!this.state.ethPreflightRes.msg && this.state.ethPreflightRes.notEnoughBalance)))
                        || this.state.preflightError || (_mode === 'spv' && !this.state.preflightError && !this.state.spvPreflightRes)
                      }
                      onClick={ Config.requirePinToConfirmTx && mainWindow.pinAccess ? this.verifyPin : () => this.changeSendCoinStep(2) }>
                      { translate('INDEX.CONFIRM') }
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }

        { this.state.currentStep === 2 &&
          <div className="col-xlg-12 col-md-12 col-sm-12 col-xs-12">
            <div className="panel">
              <div className="panel-heading">
                <h4 className="panel-title">
                  { translate('INDEX.TRANSACTION_RESULT') }
                </h4>
                <div>
                  { this.state.lastSendToResponse &&
                    !this.state.lastSendToResponse.msg &&
                    <table className="table table-hover table-striped">
                      <thead>
                        <tr>
                          <th className="padding-left-30">{ translate('INDEX.KEY') }</th>
                          <th className="padding-left-30">{ translate('INDEX.INFO') }</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="padding-left-30">
                          { translate('SEND.RESULT') }
                          </td>
                          <td className="padding-left-30">
                            <span className="label label-success">{ translate('SEND.SUCCESS_SM') }</span>
                          </td>
                        </tr>
                        { ((this.state.sendFrom && _mode === 'native') ||
                          _mode === 'spv' ||
                          _mode === 'eth') &&
                          <tr>
                            <td className="padding-left-30">
                            { translate('INDEX.SEND_FROM') }
                            </td>
                            <td className="padding-left-30 selectable word-break--all">
                              { _mode === 'spv' &&
                                <span>{ this.props.Dashboard.electrumCoins[_coin].pub }</span>
                              }
                              { _mode === 'eth' &&
                                <span>{ this.props.Dashboard.ethereumCoins[_coin].pub }</span>
                              }
                              { _mode === 'native' &&
                                <span>{ this.state.sendFrom }</span>
                              }
                            </td>
                          </tr>
                        }
                        <tr>
                          <td className="padding-left-30">
                          { translate('INDEX.SEND_TO') }
                          </td>
                          <td className="padding-left-30 selectable word-break--all">
                            { this.state.sendTo }
                          </td>
                        </tr>
                        <tr>
                          <td className="padding-left-30">
                          { translate('INDEX.AMOUNT') }
                          </td>
                          <td className="padding-left-30 selectable">
                            { this.state.amount }
                          </td>
                        </tr>
                        <tr>
                          <td className="padding-left-30">{ translate('SEND.TRANSACTION_ID') }</td>
                          <td className="padding-left-30">
                            <span className="selectable">
                            { _mode === 'spv' &&
                              <span>{ (this.state.lastSendToResponse && this.state.lastSendToResponse.txid ? this.state.lastSendToResponse.txid : '') }</span>
                            }
                            { _mode === 'native' &&
                              <span>{ this.state.lastSendToResponse }</span>
                            }
                            { _mode === 'eth' &&
                              <span>{ (this.state.lastSendToResponse && this.state.lastSendToResponse.txid ? this.state.lastSendToResponse.txid : '') }</span>                              
                            }
                            </span>
                            { ((_mode === 'spv' &&
                              this.state.lastSendToResponse &&
                              this.state.lastSendToResponse.txid) ||
                              (_mode === 'native' && this.state.lastSendToResponse && this.state.lastSendToResponse.length === 64)) &&
                              <button
                                className="btn btn-default btn-xs clipboard-edexaddr margin-left-10"
                                title={ translate('INDEX.COPY_TO_CLIPBOARD') }
                                onClick={ () => this.copyTXID(_mode === 'spv' ? (this.state.lastSendToResponse && this.state.lastSendToResponse.txid ? this.state.lastSendToResponse.txid : '') : this.state.lastSendToResponse) }>
                                <i className="icon wb-copy"></i> { translate('INDEX.COPY') }
                              </button>
                            }
                            { ((_mode === 'spv' &&
                              this.state.lastSendToResponse &&
                              this.state.lastSendToResponse.txid) ||
                              (_mode === 'native' && this.state.lastSendToResponse && this.state.lastSendToResponse.length === 64)) &&
                              explorerList[_coin] &&
                              <div className="margin-top-10">
                                <button
                                  type="button"
                                  className="btn btn-sm white btn-dark waves-effect waves-light pull-left"
                                  onClick={ () => this.openExplorerWindow(_mode === 'spv' ? (this.state.lastSendToResponse && this.state.lastSendToResponse.txid ? this.state.lastSendToResponse.txid : '') : this.state.lastSendToResponse) }>
                                  <i className="icon fa-external-link"></i> { translate('INDEX.OPEN_TRANSACTION_IN_EPLORER', _coin) }
                                </button>
                              </div>
                            }
                            { _mode === 'eth' &&
                              this.state.lastSendToResponse &&
                              this.state.lastSendToResponse.txid &&
                              <button
                                className="btn btn-default btn-xs clipboard-edexaddr margin-left-10"
                                title={ translate('INDEX.COPY_TO_CLIPBOARD') }
                                onClick={ () => this.copyTXID(this.state.lastSendToResponse.txid) }>
                                <i className="icon wb-copy"></i> { translate('INDEX.COPY') }
                              </button>
                            }
                            { _mode === 'eth' &&
                              this.state.lastSendToResponse &&
                              this.state.lastSendToResponse.txid &&
                              (explorerList[_coin] || erc20ContractId[_coin]) &&
                              <div className="margin-top-10">
                                <button
                                  type="button"
                                  className="btn btn-sm white btn-dark waves-effect waves-light pull-left"
                                  onClick={ () => this.openExplorerWindow(this.state.lastSendToResponse.txid) }>
                                  <i className="icon fa-external-link"></i> { translate('INDEX.OPEN_TRANSACTION_IN_EPLORER', 'Etherscan') }
                                </button>
                              </div>
                            }
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  }
                  { !this.state.lastSendToResponse &&
                    <div className="padding-left-30 padding-top-10">{ translate('SEND.PROCESSING_TX') }...</div>
                  }
                  { this.state.lastSendToResponse &&
                    this.state.lastSendToResponse.msg &&
                    this.state.lastSendToResponse.msg === 'error' &&
                    _mode !== 'eth' &&
                    <div className="padding-left-30 padding-top-10">
                      <div>
                        <strong className="text-capitalize">{ translate('API.ERROR_SM') }</strong>
                      </div>
                      { (this.state.lastSendToResponse.result.toLowerCase().indexOf('decode error') > -1) &&
                        <div>
                          { translate('SEND.YOUR_TXHISTORY_CONTAINS_ZTX_P1') }<br />
                          { translate('SEND.YOUR_TXHISTORY_CONTAINS_ZTX_P2') }
                        </div>
                      }
                      { this.state.lastSendToResponse.result.toLowerCase().indexOf('decode error') === -1 &&
                        <div>
                          <div>{ this.state.lastSendToResponse.result }</div>
                          { typeof this.state.lastSendToResponse.raw.txid === 'object' &&
                            <div className="padding-top-10 word-break--all">
                              <strong className="text-capitalize">Debug info</strong>: { JSON.stringify(this.state.lastSendToResponse.raw.txid) }
                            </div>
                          }
                        </div>
                      }
                      { _mode === 'spv' &&
                        this.state.lastSendToResponse.raw &&
                        this.state.lastSendToResponse.raw.txid &&
                        <div>{ typeof this.state.lastSendToResponse.raw.txid !== 'object' ? this.state.lastSendToResponse.raw.txid.replace(/\[.*\]/, '') : '' }</div>
                      }
                      { this.state.lastSendToResponse.raw &&
                        this.state.lastSendToResponse.raw.txid &&
                        JSON.stringify(this.state.lastSendToResponse.raw.txid).indexOf('bad-txns-inputs-spent') > -1 &&
                        <div className="margin-top-10">
                          { translate('SEND.BAD_TXN_SPENT_ERR1') }
                          <ul>
                            <li>{ translate('SEND.BAD_TXN_SPENT_ERR2') }</li>
                            <li>{ translate('SEND.BAD_TXN_SPENT_ERR3') }</li>
                            <li>{ translate('SEND.BAD_TXN_SPENT_ERR4') }</li>
                          </ul>
                        </div>
                      }
                    </div>
                  }
                  { this.state.lastSendToResponse &&
                    this.state.lastSendToResponse.msg &&
                    this.state.lastSendToResponse.msg === 'error' &&
                    _mode === 'eth' &&
                    <div className="padding-left-30 padding-top-10">
                      <div>Error cannot push ETH transaction.</div>
                      <div className="padding-top-10 padding-bottom-10">Debug info</div>
                      <div>{ JSON.stringify(this.state.lastSendToResponse) }</div>
                    </div>
                  }
                </div>
                { !this.props.initState &&
                  <div className="widget-body-footer">
                    <div className="widget-actions margin-bottom-15 margin-right-15">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={ () => this.changeSendCoinStep(0) }>
                        { translate('INDEX.MAKE_ANOTHER_TX') }
                      </button>
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        }

        { this.renderOPIDListCheck() &&
          _mode === 'native' &&
          <div className="col-xs-12">
            <div className="row">
              <div className="panel nav-tabs-horizontal">
                <div>
                  <div className="col-xlg-12 col-lg-12 col-sm-12 col-xs-12">
                    <div className="panel">
                      <header className="panel-heading">
                        <h3 className="panel-title">
                          { translate('INDEX.OPERATIONS_STATUSES') }
                        </h3>
                        <span className="send-clear-opids">
                          <span
                            className="pointer"
                            onClick={ this.clearOPIDsManual }>
                            <i className="icon fa-trash margin-right-5"></i>
                            { translate('SEND.CLEAR_ALL') }
                          </span>
                          <i
                            className="icon fa-question-circle settings-help margin-left-10"
                            data-tip={ translate('SEND.CLEAR_ALL_DESC') }
                            data-html={ true }
                            data-for="clearOpids"></i>
                          <ReactTooltip
                            id="clearOpids"
                            effect="solid"
                            className="text-left" />
                        </span>
                      </header>
                      <div className="panel-body">
                        <table
                          className="table table-hover dataTable table-striped"
                          width="100%">
                          <thead>
                            <tr>
                              <th>{ translate('INDEX.STATUS') }</th>
                              <th>ID</th>
                              <th>{ translate('INDEX.TIME') }</th>
                              <th>{ translate('INDEX.RESULT') }</th>
                            </tr>
                          </thead>
                          <tbody>
                            { this.renderOPIDList() }
                          </tbody>
                          <tfoot>
                            <tr>
                              <th>{ translate('INDEX.STATUS') }</th>
                              <th>ID</th>
                              <th>{ translate('INDEX.TIME') }</th>
                              <th>{ translate('INDEX.RESULT') }</th>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    );
  }
};