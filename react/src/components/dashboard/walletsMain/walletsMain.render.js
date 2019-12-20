import React from 'react';
import WalletsBalance from '../walletsBalance/walletsBalance';
import WalletsInfo from '../walletsInfo/walletsInfo';
import SendCoin from '../sendCoin/sendCoin';
import WalletsProgress from '../walletsProgress/walletsProgress';
import WalletsData from '../walletsData/walletsData';
import ReceiveCoin from '../receiveCoin/receiveCoin';
import PBaaSConvert from '../pbaasConvert/pbaasConvert'
import {
  getCoinTitle,
  isKomodoCoin,
} from '../../../util/coinHelper';
import translate from '../../../translate/translate';
import ReactImageFallback from "react-image-fallback";
import { 
  DEFAULT_CHAIN,
  MAX_COINNAME_DISPLAY_LENGTH,
  COINS_TO_SKIP
} from '../../../util/constants'


const WalletsMainRender = function() {
  const _coin = this.props.ActiveCoin.coin;

  return (
    <div className="page margin-left-0">
      <div className="padding-top-0">
        <div
          id="easydex-header-div"
          className="background-color-white"
          style={ this.getCoinStyle('transparent') }>
          <ol className={ 'coin-logo breadcrumb' + (COINS_TO_SKIP.indexOf(_coin) > -1 ? ' coin-logo-wide' : '') + ' native-coin-logo' }>
            <li className="header-easydex-section">
              { this.getCoinStyle('title') &&
                <ReactImageFallback
                  className={ 'coin-icon' + (_coin === 'KMD' ? ' kmd' : '') }
                  src={ this.getCoinStyle('title') } 
                  fallbackImage={ `assets/images/cryptologo/${DEFAULT_CHAIN}` } />
              }
              { _coin === 'KMD' &&
                <img
                  className="kmd-mobile-icon"
                  src={ `assets/images/cryptologo/btc/${_coin.toLowerCase()}.png` } />
              }
              { COINS_TO_SKIP.indexOf(_coin) === -1 &&
                <span className="margin-left-20 easydex-section-image">
                  { _coin.length <= MAX_COINNAME_DISPLAY_LENGTH ?
                      translate(((this.props.ActiveCoin.mode === 'spv' || 
                      this.props.ActiveCoin.mode === 'native') && 
                      isKomodoCoin(_coin) ? 'ASSETCHAINS.' : 'CRYPTO.') + _coin.toUpperCase()) 
                    :
                      ((
                        translate(((this.props.ActiveCoin.mode === 'spv' || 
                        this.props.ActiveCoin.mode === 'native') && 
                        isKomodoCoin(_coin) ? 'ASSETCHAINS.' : 'CRYPTO.') + _coin.toUpperCase())).substr(0, MAX_COINNAME_DISPLAY_LENGTH) + '...')}
                </span>
              }
            </li>
          </ol>
        </div>
        <div className="page-content page-content-native">
          { this.props.ActiveCoin.mode === 'native' &&
            <WalletsProgress />
          }
          <div className="row">
            { this.props.ActiveCoin.activeSection === 'receive' &&
              <ReceiveCoin />
            }
            { this.props.ActiveCoin.activeSection === 'default' &&
              <React.Fragment>
                <WalletsBalance />
                <WalletsData />
              </React.Fragment>
            }
            { this.props.ActiveCoin.activeSection === 'send' &&
              <SendCoin />
            }
            { this.props.ActiveCoin.activeSection === 'settings' && 
              <WalletsInfo />
            }
            { this.props.ActiveCoin.activeSection === 'convert' &&
              <PBaaSConvert />
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletsMainRender;