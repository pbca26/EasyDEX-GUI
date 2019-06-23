import React from 'react';
import translate from '../../../translate/translate';
import { fromSats } from 'agama-wallet-lib/src/utils';
import { estimateReward } from './chainData';

const EXPONENTIAL = 'exponential'
const LINEAR = 'linear'
const LINEAR_DECAY = 100000000

export const chainInfoTableRender = function(chain) {
  let _chain
  let _latestHeight
  if (chain.chaindefinition) {
    _chain = chain.chaindefinition
    _latestHeight = chain.latestheight
  } else {
    _chain = chain
    _latestHeight = null
  }

  return (
    <div>
      <div className="table-responsive chain-info-table">
        <table className="table table-striped">
          <tbody>
            <tr>
              <td>{ translate('PBAAS.NAME') }</td>
              <td>
                { _chain.name }
              </td>
            </tr>
            <tr>
              <td>{ translate('PBAAS.START_BLOCK') }</td>
              <td>
                { _chain.startblock }
              </td>
            </tr>
            <tr>
              <td>{ translate('PBAAS.PREMINE_AMOUNT') }</td>
              <td>
                { fromSats(Number(_chain.premine)) }
              </td>
            </tr>
            <tr>
              <td>{ translate('PBAAS.NOTARIZATION_REWARD') }</td>
              <td>
                { fromSats(Number(_chain.notarizationreward)) }
              </td>
            </tr>
            <tr>
              <td>{ translate('PBAAS.NUMBER_OF_ERAS') }</td>
              <td>
                { _chain.eras.length }
              </td>
            </tr>
            <tr>
              <td>{ translate('PBAAS.REWARD_ERAS') }</td>
              <td>
                <div className={ "era-capsule-container" }>
                  { erasRender.call(this, _chain) }
                </div>
              </td>
            </tr>
            <tr>
              <td>{ translate('PBAAS.CONVERTIBLE_AMOUNT') }</td>
              <td>
                { fromSats(Number(_chain.conversion)) }
              </td>
            </tr>
            <tr>
              <td>{ translate('PBAAS.CONVERSION_PERCENT') }</td>
              <td>
                { _chain.conversionpercent }
              </td>
            </tr>
            <tr>
              <td>{ translate('PBAAS.VERSION') }</td>
              <td>
                { _chain.version }
              </td>
            </tr>
            <tr>
              <td>{ translate('PBAAS.NODES') }</td>
              <td>
                <div className={ "era-capsule-container" }>
                  { nodesRender.call(this, _chain) }
                </div>
              </td>
            </tr>
            <tr className={_latestHeight !== null ? "" : "hide"}>
              <td>{ translate('PBAAS.LAST_NOTARY_HEIGHT') }</td>
              <td>
                { _latestHeight }
              </td>
            </tr>
            <tr className={_latestHeight !== null ? "" : "hide"}>
              <td>{ translate('PBAAS.LAST_BLOCK_REWARD') }</td>
              <td>
                { estimateReward(_chain, _latestHeight) }
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export const erasRender = function(chain) {
  return (
    chain.eras.map((rewardEra, index) => {
      let decayType = Number(rewardEra.decay) === LINEAR_DECAY ? LINEAR : EXPONENTIAL

      return (
        <div className="chain-info-era-capsule">
          <div className="capsule-title">{ translate('PBAAS.ERA') + ' ' + (index + 1)}</div>
          <div>
            { translate('PBAAS.INITIAL_REWARD') + ': ' }
            { fromSats(Number(rewardEra.reward)) }
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
          <div className={ !(index < chain.eras.length - 1) ? 'hide' : ''}>
            { translate('PBAAS.END_BLOCK') + ': ' }
            { rewardEra.eraend }
          </div>
        </div>
      )
    })
  )
}

export const nodesRender = function(chain) {
  return (
    chain.nodes.map((node, index) => {
      return (
        <div className="confirm-era-capsule">
          <div className="capsule-title">{ translate('PBAAS.NODE') + ' ' + (index + 1)}</div>
          <div>
            { translate('PBAAS.NODE_ADDRESS') + ': ' + node.networkaddress }
          </div>
          <div>
            { translate('PBAAS.PAYMENT_ADDRESS') + ': ' + node.paymentaddress }
          </div>
        </div>
      )
    })
  )
}