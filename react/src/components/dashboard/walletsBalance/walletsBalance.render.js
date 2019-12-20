import React from 'react';
import ReactTooltip from 'react-tooltip';
import translate from '../../../translate/translate';
import Spinner from '../spinner/spinner';
import Config from '../../../config';
import mainWindow, { staticVar } from '../../../util/mainWindow';
import { isKomodoCoin } from 'agama-wallet-lib/src/coin-helpers';
import { isPbaasChain } from '../../../util/pbaas/pbaasChainUtils'

const WalletsBalanceRender = function() {
  const _mode = this.props.ActiveCoin.mode;
  const _coin = this.props.ActiveCoin.coin;
  const notAcPrivate = (staticVar.chainParams && staticVar.chainParams[_coin] && !staticVar.chainParams[_coin].ac_private) 
  || Config.reservedChains.indexOf(_coin) === -1;
  
  const onlyTBalance = ((this.props.ActiveCoin.coin === 'CHIPS' ||
  (this.props.ActiveCoin.mode === 'spv' && this.props.ActiveCoin.coin !== 'KMD') ||
  this.renderBalance('total') === this.renderBalance('transparent') ||
  (this.renderBalance('total') === 0) && this.renderBalance('immature') === 0 && this.renderBalance('reserve') === 0)) &&
  ((this.renderBalance('immature') === 0 && this.renderBalance('reserve') === 0) || this.props.ActiveCoin.mode === 'spv')

  return (
    <div
      id="wallet-widgets"
      className="wallet-widgets">
      { this.renderBalance('transparent') !== -777 &&
        <div className="col-xs-12 flex">
        { (_mode === 'spv' ||
            _mode === 'eth' ||
            (_mode === 'native' && notAcPrivate) ||
            (_mode === 'native' && _coin === 'KMD')) &&
            <div className={
              onlyTBalance ? 'col-lg-12 col-xs-12 balance-placeholder--bold' : (this.renderBalance('total') === 0 && this.renderBalance('immature') > 0) ? 'hide' : 'col-lg-4 col-xs-12'
            }>
              <div className="widget widget-shadow">
                <div className="widget-content">
                  { this.state.loading &&
                    <span className="spinner--small">
                      <Spinner />
                    </span>
                  }
                  { !this.state.loading &&
                    <i
                      className="icon fa-refresh manual-balance-refresh pointer"
                      onClick={ this.refreshBalance }></i>
                  }
                  <div className="padding-10 padding-top-10">
                    <div className="clearfix cursor-default">
                      <div className="pull-left padding-vertical-10 min-width-160l">
                        { this.props.ActiveCoin.coin !== 'CHIPS' &&
                          this.props.ActiveCoin.mode !== 'spv' &&
                          <i className="icon fa-eye font-size-24 vertical-align-bottom margin-right-5"></i>
                        }
                        { this.props.ActiveCoin.mode === 'spv' &&
                          Number(this.renderBalance('interest')) > 0 &&
                          <span className="padding-right-30">&nbsp;</span>
                        }
                        { this.props.ActiveCoin.coin === 'CHIPS' || this.props.ActiveCoin.mode === 'spv' ? translate('INDEX.BALANCE') : translate('INDEX.TRANSPARENT_BALANCE') }
                        { this.props.ActiveCoin.mode === 'spv' &&
                          Number(this.props.ActiveCoin.balance.unconfirmed) < 0 &&
                          <span>
                            <i
                              className="icon fa-info-circle margin-left-5 icon-unconf-balance"
                              data-tip={ `${translate('INDEX.UNCONFIRMED_BALANCE')} ${Math.abs(this.props.ActiveCoin.balance.unconfirmed)}` }></i>
                            <ReactTooltip
                              effect="solid"
                              className="text-left" />
                          </span>
                        }
                      </div>
                      <span
                        className={`pull-right padding-top-10 font-size-20 ${onlyTBalance ? "min-width-160r" : "balance-text"}`}>
                        { this.renderBalance('transparent', true) }
                        <ReactTooltip
                          effect="solid"
                          className="text-left" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }

          <div className={ (this.props.ActiveCoin.mode === 'native' && Number(this.renderBalance('private'))) > 0 ? 'col-lg-4 col-xs-12' : 'hide' }>
            <div className="widget widget-shadow">
              <div className="padding-10 padding-top-10">
                <div className="clearfix cursor-default">
                  <div className="pull-left padding-vertical-10 min-width-160l">
                    <i className="icon fa-eye-slash font-size-24 vertical-align-bottom margin-right-5"></i>
                    { translate('INDEX.Z_BALANCE') }
                  </div>
                  <span
                    className="pull-right padding-top-10 font-size-20 balance-text"
                    data-tip={ Config.roundValues ? this.renderBalance('private') : '' }>
                    { this.renderBalance('private', true) }
                  </span>
                  <ReactTooltip
                    effect="solid"
                    className="text-left" />
                </div>
              </div>
            </div>
          </div>

          <div className={ 
            (this.props.ActiveCoin.mode === 'native' && Number(this.renderBalance('immature'))) > 0 ? 
              ((Number(this.renderBalance('total')) > 0) ? 'col-lg-4 col-xs-12' : 'col-lg-12 col-xs-12 balance-placeholder--bold')
              : 
              'hide' }>
            <div className="widget widget-shadow">
            <div className="widget-content">
              <div className="padding-10 padding-top-10">
                <div className="clearfix cursor-default">
                  <div className="pull-left padding-vertical-10 min-width-160l">
                    <i className="icon fa-clock-o font-size-24 vertical-align-bottom margin-right-5"></i>
                    { translate('INDEX.IMMATURE_BALANCE') }
                  </div>
                  <span
                    className={"pull-right padding-top-10 font-size-20 " + ((Number(this.renderBalance('total')) > 0) ? 'balance-text' : 'min-width-160r')}
                    data-tip={ Config.roundValues ? this.renderBalance('immature') : '' }>
                    { this.renderBalance('immature', true) }
                  </span>
                  <ReactTooltip
                    effect="solid"
                    className="text-left" />
                </div>
              </div>
              </div>
            </div>
          </div>

          <div className={ 
              (isPbaasChain(this.props.ActiveCoin.coin) && Number(this.renderBalance('reserve')) > 0) > 0 ? 
              ((Number(this.renderBalance('total')) > 0 || Number(this.renderBalance('immature')) > 0) ? 'col-lg-4 col-xs-12' : 'col-lg-12 col-xs-12 balance-placeholder--bold')
              : 
              'hide'}>
            <div className="widget widget-shadow">
            <div className="widget-content">
              <div className="padding-10 padding-top-10">
                <div className="clearfix cursor-default">
                  <div className="pull-left padding-vertical-10 min-width-160l">
                    <i className="icon fa-share-alt-square font-size-24 vertical-align-bottom margin-right-5"></i>
                    { translate('INDEX.RESERVE_BALANCE') }
                  </div>
                  <span
                    className={"pull-right padding-top-10 font-size-20 " + ((Number(this.renderBalance('total')) > 0 || Number(this.renderBalance('immature')) > 0) ? 'balance-text' : 'min-width-160r')}
                    data-tip={ Config.roundValues ? this.renderBalance('reserve') : '' }>
                    { this.renderBalance('reserve', true) }
                  </span>
                  <ReactTooltip
                    effect="solid"
                    className="text-left" />
                </div>
              </div>
              </div>
            </div>
          </div>

          <div className={ this.props.ActiveCoin.coin === 'KMD' && Number(this.renderBalance('interest')) > 0 ? 'col-lg-4 col-xs-12' : 'hide' }>
            <div className="widget widget-shadow">
              <div className="widget-content">
                <div className="padding-10 padding-top-10">
                  <div className="clearfix cursor-default">
                    <div className="pull-left padding-vertical-10 min-width-160l">
                      <i className="icon fa-money font-size-24 vertical-align-bottom margin-right-5"></i>
                      { translate('INDEX.INTEREST_EARNED') }
                    </div>
                    <span
                      className="pull-right padding-top-10 font-size-20 balance-text"
                      data-tip={ Config.roundValues ? this.renderBalance('interest') : '' }>
                      { this.renderBalance('interest', true) }
                    </span>
                    <ReactTooltip
                      effect="solid"
                      className="text-left" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={
            this.props.ActiveCoin.coin === 'CHIPS' ||
            (this.props.ActiveCoin.coin !== 'KMD' && this.props.ActiveCoin.mode === 'spv') ||
            Number(this.renderBalance('total')) === 0 ||
            this.renderBalance('total') === this.renderBalance('transparent') ? 'hide' : 'col-lg-4 col-xs-12'
          }>
            <div className="widget widget-shadow">
              <div className="widget-content">
                <div className="padding-10 padding-top-10">
                  <div className="clearfix cursor-default">
                    <div className="pull-left padding-vertical-10 min-width-160l">
                      <i className="icon fa-bullseye font-size-24 vertical-align-bottom margin-right-5"></i>
                      { translate('INDEX.SPENDABLE_BALANCE') }
                    </div>
                    <span
                      className="pull-right padding-top-10 font-size-20 balance-text"
                      data-tip={ Config.roundValues ? this.renderBalance('total') : '' }>
                      { this.renderBalance('total', true) }
                    </span>
                    <ReactTooltip
                      effect="solid"
                      className="text-left" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  );
};

export default WalletsBalanceRender;