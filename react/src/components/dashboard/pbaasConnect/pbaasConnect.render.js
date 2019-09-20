import React from 'react';
import translate from '../../../translate/translate';
import mainWindow from '../../../util/mainWindow';
import ReactTooltip from 'react-tooltip';
import Config from '../../../config';
import { chainInfoTableRender, reserveChainInfoTableRender } from '../pbaasGeneralRenders/chainInfoRenders';

const VRSC_LOGO_DIR = `assets/images/cryptologo/btc/vrsc.png`

export const PBaaSConnectRender = function() {
  return (
    <div className="col-xs-12 margin-top-20 backround-gray">
      <div className="col-xlg-12 col-lg-12 col-sm-12 col-xs-12">
        <div className="panel connect-panel no-margin center">
          <img
            className={ 'coin-icon' }
            src={ VRSC_LOGO_DIR } 
            height="75"
            width="75"/>
          <h4>
          { translate('PBAAS.PBAAS_CONNECT') }
          </h4>
          <input
          type="text"
          className={ 'form-control pbaas-connect-form' }
          name="chain"
          onChange={ this.updateInput }
          value={ this.state.chain }
          disabled={ this.state.loading }
          id="connectToPbaasChain"
          placeholder={ translate('PBAAS.ENTER_CHAIN_NAME') }
          autoComplete="off"
          required />
          <button
            type="button"
            className="btn btn-success waves-effect waves-light"
            onClick={ this.getChainInfo.bind(this) }
            disabled={ this.state.loading || this.state.chain.length === 0 }>
            <i className="icon fa-search"></i> { translate('PBAAS.FIND') }
          </button>
        </div>

        {this.state.resultsShown && 
          <div className="panel info-panel">
            <div className="panel-heading">
              <h3 className="panel-title">{ translate('PBAAS.CHAIN_FOUND', this.state.chainInfo.name) }</h3>
            </div>
            <div className="panel-body container-fluid">
              <div className="font-weight-600">{ translate('PBAAS.CONFIRM_DATA') }</div>
              <div className="chain-info-description">{ translate('PBAAS.CHAIN_FOUND_DESC') }</div>
              { chainInfoTableRender.call(this, this.state.chainInfo, this.props.CurrentHeight) }
              <div className="font-weight-600">{ translate('PBAAS.RESERVE_CONFIRMATION') }</div>
              <div className="chain-info-description">{ translate('PBAAS.RESERVE_CONFIRMATION_DESC') }</div>
              { reserveChainInfoTableRender.call(this, this.state.chainInfo) }
              <div className="chain-options">
                <button
                  type="button"
                  className="btn btn-primary waves-effect waves-light"
                  onClick={ this.hideChainData.bind(this) }>
                  { translate('PBAAS.CANCEL') }
                </button>
                <button
                  type="button"
                  className="btn btn-success waves-effect waves-light"
                  onClick={ this.activatePbaasChain.bind(this) }>
                  <i className="icon fa-plug"></i> { translate('PBAAS.CONNECT') }
                </button>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  );
}


