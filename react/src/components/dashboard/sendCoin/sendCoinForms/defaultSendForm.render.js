import React from 'react'
import {
  isPositiveNumber
} from 'agama-wallet-lib/src/utils';
import {
  isKomodoCoin
} from 'agama-wallet-lib/src/coin-helpers';
import translate from '../../../../translate/translate';
import { staticVar } from '../../../../util/mainWindow';
import Config from '../../../../config';

const defaultSendFormRender = (self) => {
  const _coin = self.props.ActiveCoin.coin;
  const _mode = self.props.ActiveCoin.mode;
  const _isAcPrivate = staticVar.chainParams && staticVar.chainParams[_coin] && staticVar.chainParams[_coin].ac_private;
  
  return (
    <div className="row">
      <div className="col-xlg-12 form-group form-material">
        { ((_mode === 'spv' && self.renderAddressBookDropdown(true) < 1) ||
            _mode === 'eth') &&
            !self.props.initState &&
          <button
            type="button"
            className="btn btn-default btn-send-self"
            onClick={ self.setSendToSelf }>
            { translate('SEND.SELF') }
          </button>
        }
        { self.props.AddressBook &&
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
        }
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
          placeholder={ translate('SEND.' + (_mode === 'spv' || _mode === 'eth' ? 'ENTER_ADDRESS' : (_mode === 'native' && _coin !== 'KMD' && _isAcPrivate) ? 'ENTER_Z_ADDR' : 'ENTER_T_OR_Z_ADDR')) }
          autoComplete="off"
          required />
      </div>
      <div className="col-lg-12 form-group form-material">
        { !self.props.initState &&
          <button
            type="button"
            className="btn btn-default btn-send-self"
            onClick={ self.setSendAmountAll }>
            { translate('SEND.ALL') }
          </button>
        }
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
          placeholder={translate('SEND.ENTER_AMOUNT')}
          autoComplete="off" />
      </div>
      { (self.props.ActiveCoin.coin === 'VRSC' || 
        self.props.ActiveCoin.coin === 'VRSCTEST' || 
        Config.reservedChains.indexOf(self.props.ActiveCoin.coin) === -1) && (self.state.sendTo.length === 95 || self.state.sendTo.length === 78) && 
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
      { self.isTransparentTx() &&
        _mode === 'native' &&
        <div className="col-lg-6 form-group form-material">
          { self.state.sendTo.length <= 34 &&
            <span className="pointer">
              <label className="switch">
                <input
                  type="checkbox"
                  checked={ self.state.subtractFee }
                  readOnly />
                <div
                  className="slider"
                  onClick={ () => self.toggleSubtractFee() }></div>
              </label>
              <div
                className="toggle-label"
                onClick={ () => self.toggleSubtractFee() }>
                { translate('DASHBOARD.SUBTRACT_FEE') }
              </div>
            </span>
          }
        </div>
      }
      { self.renderBTCFees() }
      { self.renderETHFees() }
      { _mode === 'spv' &&
        Config.spv.allowCustomFees &&
        <div className="col-lg-12 form-group form-material">
          <label
            className="control-label"
            htmlFor="kmdWalletFee">
            { translate('INDEX.FEE_PER_TX') }
          </label>
          <input
            type="text"
            className="form-control"
            name="fee"
            onChange={ self.updateInput }
            id="kmdWalletFee"
            placeholder="0.0001"
            value={ self.state.fee !== 0 ? self.state.fee : '' }
            autoComplete="off" />
          <button
            type="button"
            className="btn btn-default btn-send-self"
            onClick={ self.setDefaultFee }>
            { translate('INDEX.DEFAULT') }
          </button>
        </div>
      }
      { _mode === 'native' && self.state.sendFrom &&
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
      }
      { _mode === 'spv' &&
        Config.spv.allowCustomFees &&
        self.state.amount > 0 &&
        isPositiveNumber(self.state.fee) &&
        isPositiveNumber(self.state.amount) &&
        <div className="col-lg-12">
          <span>
            <strong>{ translate('INDEX.TOTAL') }:</strong>&nbsp;
            { self.state.amount } + { self.state.fee } = { Number((Number(self.state.amount) + Number(self.state.fee)).toFixed(8)) }&nbsp;
            { _coin }
          </span>
        </div>
      }
      { (!self.isFullySynced() || !navigator.onLine) &&
        self.props.ActiveCoin &&
        _mode === 'native' &&
        <div className="col-lg-12 padding-top-20 padding-bottom-20 send-coin-sync-warning">
          <i className="icon fa-warning color-warning margin-right-5"></i>&nbsp;
          <span className="desc">{ translate('SEND.SEND_NATIVE_SYNC_WARNING') }</span>
        </div>
      }
      { self.props.ActiveCoin &&
        self.props.ActiveCoin.balance &&
        self.props.ActiveCoin.balance.interest > 0 &&
        <div>
          <div className="col-lg-12 padding-top-20 padding-bottom-20 send-coin-sync-warning">
            <i className="icon fa-warning color-warning margin-right-5"></i>&nbsp;
            <span className="desc">{ translate('SEND.NONZERO_INTEREST_WARNING', self.props.ActiveCoin.coin) }</span>
          </div>
          <div className="col-lg-12 padding-top-20 padding-bottom-20 send-coin-sync-warning">
            <label className="switch">
              <input
                type="checkbox"
                checked={ self.state.donateInterest }
                readOnly />
              <div
                className="slider"
                onClick={ self.toggleDonateInterest.bind(this) }></div>
            </label>
            <div
              className="toggle-label"
              onClick={ self.toggleDonateInterest.bind(this) }>
              { translate('SEND.NONZERO_INTEREST_CONFIRM') }
            </div>
          </div>
        </div>
      }
      <div className="col-lg-12">
        <button
          type="button"
          className="btn btn-primary waves-effect waves-light pull-right"
          onClick={ self.props.renderFormOnly ? self.handleSubmit : () => self.changeSendCoinStep(1) }
          disabled={
            !self.state.sendTo ||
            !self.state.amount ||
            (_coin === 'BTC' && !Number(self.state.btcFeesSize)) ||
            (_mode === 'eth' && !self.state.ethFees) ||
            (self.props.ActiveCoin && self.props.ActiveCoin.balance && 
              self.props.ActiveCoin.balance.interest > 0 && !self.state.donateInterest)
          }>
          { translate('INDEX.SEND') } { self.state.amount } { _coin }
        </button>
      </div>
    </div>
  )
}

export default defaultSendFormRender