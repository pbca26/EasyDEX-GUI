import React from 'react';
import translate from '../../../translate/translate';
import { secondsToString } from 'agama-wallet-lib/src/time';
import { explorerList } from 'agama-wallet-lib/src/coin-helpers';
import { chainInfoTableRender } from '../pbaasRenders/chainInfoRenders';

const ChainInfoRender = function(chainInfo) { 
  return (
    <div onKeyDown={ (event) => this.handleKeydown(event) }>
      <div
        className={ `modal modal-3d-sign tx-details-modal ${this.state.className}` }
        id="kmd_txid_info_mdl">
        <div
          onClick={ this.toggleChainInfoModal }
          className="modal-close-overlay"></div>
        <div className="modal-dialog modal-center modal-lg">
          <div
            onClick={ this.toggleChainInfoModal }
            className="modal-close-overlay"></div>
          <div className="modal-content">
            <div className="modal-header bg-orange-a400 wallet-send-header">
               <button
                 type="button"
                 className="close white"
                 onClick={ this.toggleChainInfoModal }>
                 <span>×</span>
               </button>
               <h4 className="modal-title white">
                 { translate('PBAAS.CHAIN_DETAILS') }
               </h4>
             </div>
            <div className="modal-body modal-body-container">
              <div className="panel-body">
                { this.state.chainInfo ? chainInfoTableRender.call(this, chainInfo) : (translate('PBAAS.FAILED_LOAD_CHAIN')) }
              </div>
            </div>
            <div className="modal-footer">
              <div className="chain-options">
                <button
                  type="button"
                  className="btn btn-primary waves-effect waves-light"
                  onClick={ this.toggleChainInfoModal }>
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
        </div>
      </div>
      <div className={ `modal-backdrop ${this.state.className}` }></div>
    </div>
  );
};

export default ChainInfoRender;