import React from 'react';
import translate from '../../../translate/translate';
import mainWindow from '../../../util/mainWindow';
import ReactTooltip from 'react-tooltip';
import Config from '../../../config';

const VRSC_LOGO_DIR = `assets/images/cryptologo/btc/vrsc.png`
const EXPONENTIAL = 'exponential'
const LINEAR = 'linear'
const LINEAR_DECAY = 100000000

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
            <i className="icon fa-plug"></i> { translate('PBAAS.CONNECT') }
          </button>
        </div>

        {this.state.resultsShown && 
          <div className="panel info-panel">
            <div className="panel-heading">
              <h3 className="panel-title">{ translate('PBAAS.CHAIN_PARAMS') }</h3>
            </div>
            <div className="panel-body container-fluid">
              { this.chainInfoRender() }
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
                  { translate('PBAAS.ACTIVATE') }
                </button>
              </div>
            </div>
          </div>
        }

      </div>
    </div>
  );
}

export const _chainInfoRender = function() {
  return (
    <div>
      <div className="font-weight-600">{ translate('PBAAS.CONFIRM_DATA') }</div>
      <div className="chain-info-description">{ translate('PBAAS.CONFIRM_DATA_DESC') }</div>
      <div className="table-responsive">
        <table className="table table-striped">
          <tbody>
            <tr>
              <td>{ translate('PBAAS.NAME') }</td>
              <td>
                { this.state.chainInfo.name }
              </td>
            </tr>
            <tr>
              <td>{ translate('PBAAS.START_BLOCK') }</td>
              <td>
                { this.state.chainInfo.startblock }
              </td>
            </tr>
            <tr>
              <td>{ translate('PBAAS.PREMINE_AMOUNT') }</td>
              <td>
                { this.state.chainInfo.premine }
              </td>
            </tr>
            <tr>
              <td>{ translate('PBAAS.NOTARIZATION_REWARD') }</td>
              <td>
                { this.state.chainInfo.notarizationreward }
              </td>
            </tr>
            <tr>
              <td>{ translate('PBAAS.NUMBER_OF_ERAS') }</td>
              <td>
                { this.state.chainInfo.eras.length }
              </td>
            </tr>
            <tr>
              <td>{ translate('PBAAS.REWARD_ERAS') }</td>
              <td>
                <div className={ "era-capsule-container" }>
                  { this.erasRender() }
                </div>
              </td>
            </tr>
            <tr>
              <td>{ translate('PBAAS.CONVERTIBLE_AMOUNT') }</td>
              <td>
                { this.state.chainInfo.conversion }
              </td>
            </tr>
            <tr>
              <td>{ translate('PBAAS.CONVERSION_PERCENT') }</td>
              <td>
                { this.state.chainInfo.conversionpercent }
              </td>
            </tr>
            <tr>
              <td>{ translate('PBAAS.VERSION') }</td>
              <td>
                { this.state.chainInfo.version }
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export const _erasRender = function() {
  return (
    this.state.chainInfo.eras.map((rewardEra, index) => {
      let decayType = Number(rewardEra.decay) === LINEAR_DECAY ? LINEAR : EXPONENTIAL

      return (
        <div className="chain-info-era-capsule">
          <div className="capsule-title">{ translate('PBAAS.ERA') + ' ' + (index + 1)}</div>
          <div>
            { translate('PBAAS.INITIAL_REWARD') + ': ' }
            { Number(rewardEra.reward)/100000000 }
          </div>
          <div>
            { translate('PBAAS.REWARD_DECAY_TYPE') + ': ' + decayType }
          </div>
          <div className={ decayType === LINEAR ? 'hide' : ''}>
            { translate('PBAAS.FREQUENCY') + ': ' }
            { rewardEra.halving }
          </div>
          <div className={ decayType === LINEAR ? 'hide' : ''}>
            { translate('PBAAS.MAGNITUDE') + ': ' }
            { Number(rewardEra.decay) === 0 ? 2 : LINEAR_DECAY/Number(rewardEra.decay) }
          </div>
          <div className={ !(index < this.state.chainInfo.eras.length - 1) ? 'hide' : ''}>
            { translate('PBAAS.END_BLOCK') + ': ' }
            { rewardEra.eraend }
          </div>
        </div>
      )
    })
  )
}
