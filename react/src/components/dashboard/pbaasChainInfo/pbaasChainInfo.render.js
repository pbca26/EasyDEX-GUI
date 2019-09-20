import React from 'react';
import translate from '../../../translate/translate';
import { secondsToString } from 'agama-wallet-lib/src/time';
import { explorerList } from 'agama-wallet-lib/src/coin-helpers';
import { chainInfoTableRender, reserveChainInfoTableRender } from '../pbaasGeneralRenders/chainInfoRenders';

const ChainInfoRender = function(chainInfo) { 
  return (
    <div onKeyDown={ (event) => this.handleKeydown(event) }>
      <div
        className={ `modal modal-3d-sign chain-details-modal ${this.state.className}` }
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
            <div className="modal-body modal-body-container chain-info-table">
              <ul className="nav nav-tabs nav-tabs-line">
                <li className={ this.state.activeTab === 0 ? 'active' : '' }>
                  <a onClick={ () => this.openTab(0) }>
                    <i className="icon md-link"></i>{ translate('PBAAS.CHAIN_INFO') }
                  </a>
                </li>
                {chainInfo.bestcurrencystate &&
                <li className={ this.state.activeTab === 1 ? 'active' : '' }>
                  <a onClick={ () => this.openTab(1) }>
                    <i className="icon md-device-hub"></i>{ translate('PBAAS.RESERVE_DATA') }
                  </a>
                </li>}
              </ul>
              <div className="panel-body">
                { this.state.chainInfo ? 
                    (this.state.activeTab === 0 ? 
                      chainInfoTableRender.call(this, chainInfo, this.props.CurrentHeight)
                      :
                      reserveChainInfoTableRender.call(this, chainInfo)) 
                    : 
                    (translate('PBAAS.FAILED_LOAD_CHAIN')) }
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