import React from 'react';
import translate from '../../../translate/translate';
import { fromSats, toSats } from 'agama-wallet-lib/src/utils';
import { estimateReward } from '../../../util/pbaas/pbaasTxUtils';
import {
  EXPONENTIAL,
  LINEAR,
  LINEAR_DECAY
} from '../../../util/constants';
import ReactTooltip from 'react-tooltip';
import { getChainStatus } from '../../../util/pbaas/pbaasChainUtils'
import Config from '../../../config'
import { PBAAS_ROOT_CHAIN } from '../../../util/pbaas/pbaasConstants'
import { blocksToTime } from '../../../util/blockMath'

export const chainInfoTableRender = function(chain, currentHeight) {
  let _chain
  let _lastconfirmedheight
  let _status
  let _age

  if (chain.chaindefinition) {
    _chain = chain.chaindefinition
    _lastconfirmedheight = chain.lastconfirmedheight
  } else {
    _chain = chain
    _lastconfirmedheight = null
  }

  _age = Number(_chain.startblock) - Number(currentHeight)
  _status = getChainStatus(
    currentHeight,
    _chain.startblock,
    _chain.minpreconvert,
    _chain.maxpreconvert,
    toSats(chain.bestcurrencystate ? chain.bestcurrencystate.initialsupply : 0),
    chain.bestcurrencystate ? chain.bestcurrencystate.priceinreserve : 0)

  return (
    <div>
      <div className="table-responsive chain-info-table">
        <table className="table table-striped">
          <tbody>
            <tr>
              <td>
                { translate('PBAAS.CHAIN_STATUS') }
              </td>
              <td>
                { _status.icon }
              </td>
            </tr>
            <tr>
              <td>{ translate('PBAAS.NAME') }</td>
              <td>
                { _chain.name }
              </td>
            </tr>
            <tr>
              <td>{ translate('PBAAS.START_BLOCK') }</td>
              <td>
                { `${_chain.startblock}${currentHeight && _status.state !== 'FAILED' ? ` (approx. ${blocksToTime(Math.abs(_age))} ${translate(`PBAAS.${_age < 0 ? 'OLD' : 'UNTIL_LAUNCH'}`)})` : ''}` }
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
            <tr className={_lastconfirmedheight !== null ? "" : "hide"}>
              <td>{ translate('PBAAS.LAST_NOTARY_HEIGHT') }</td>
              <td>
                { _lastconfirmedheight }
              </td>
            </tr>
            <tr className={_lastconfirmedheight !== null ? "" : "hide"}>
              <td>{ translate('PBAAS.LAST_BLOCK_REWARD') }</td>
              <td>
                { estimateReward(_chain, _lastconfirmedheight) }
              </td>
            </tr>
            <tr className={_chain.chainaddress ? "" : "hide"}>
              <td>{ translate('PBAAS.CHAIN_ADDRESS') }</td>
              <td>
                { _chain.chainaddress }
              </td>
            </tr>
            <tr>
              <td>
                { translate('PBAAS.INITIAL_CONVERSION_RATE') }
                {<span>
                  <i
                    className="icon fa-question-circle settings-help"
                    data-html={ true }
                    data-for="initConversionRate"
                    data-tip={ translate(`PBAAS.INITIAL_CONVERSION_RATE_INFO`, PBAAS_ROOT_CHAIN) }></i>
                  <ReactTooltip
                    id="initConversionRate"
                    effect="solid"
                    className="text-left" 
                    place="right" />
                </span>}
              </td>
              <td>
                { fromSats(_chain.conversion)  + ' ' + PBAAS_ROOT_CHAIN + '/' + _chain.name }
              </td>
            </tr>
            <tr>
              <td>
                { translate('PBAAS.INITIAL_CONTRIBUTION') }
                {<span>
                  <i
                    className="icon fa-question-circle settings-help"
                    data-html={ true }
                    data-for="initContribution"
                    data-tip={ translate(`PBAAS.INITIAL_CONTRIBUTION_INFO`) }></i>
                  <ReactTooltip
                    id="initContribution"
                    effect="solid"
                    className="text-left" 
                    place="right" />
                </span>}
              </td>
              <td>
                { fromSats(_chain.initialcontribution) }
              </td>
            </tr>
            <tr>
              <td>
                { translate('PBAAS.LAUNCH_FEE') }
                {<span>
                  <i
                    className="icon fa-question-circle settings-help"
                    data-html={ true }
                    data-for="launchfee"
                    data-tip={ translate(`PBAAS.LAUNCH_FEE_INFO`) }></i>
                  <ReactTooltip
                    id="launchfee"
                    effect="solid"
                    className="text-left" 
                    place="right" />
                </span>}
              </td>
              <td>
                { `${(fromSats(_chain.launchfee) * 100).toFixed(2)}%` }
              </td>
            </tr>
            <tr>
              <td>
                { translate('PBAAS.MIN_PRECONVERT') }
                {<span>
                  <i
                    className="icon fa-question-circle settings-help"
                    data-html={ true }
                    data-for="minPreconvert"
                    data-tip={ translate(`PBAAS.MIN_PRECONVERT_INFO`) }></i>
                  <ReactTooltip
                    id="minPreconvert"
                    effect="solid"
                    className="text-left" 
                    place="right" />
                </span>}
              </td>
              <td>
                { fromSats(_chain.minpreconvert) }
              </td>
            </tr>
            <tr>
              <td>
                { translate('PBAAS.MAX_PRECONVERT') }
                {<span>
                  <i
                    className="icon fa-question-circle settings-help"
                    data-html={ true }
                    data-for="maxPreconvert"
                    data-tip={ translate(`PBAAS.MAX_PRECONVERT_INFO`) }></i>
                  <ReactTooltip
                    id="maxPreconvert"
                    effect="solid"
                    className="text-left" 
                    place="right" />
                </span>}
              </td>
              <td>
                { fromSats(_chain.maxpreconvert) }
              </td>
            </tr>
            { _chain.preconverted > 0 &&
            <tr>
              <td>
                { translate('PBAAS.PRECONVERTED') }
                {<span>
                  <i
                    className="icon fa-question-circle settings-help"
                    data-html={ true }
                    data-for="preconverted"
                    data-tip={ translate(`PBAAS.PRECONVERTED`) }></i>
                  <ReactTooltip
                    id="preconverted"
                    effect="solid"
                    className="text-left" 
                    place="right" />
                </span>}
              </td>
              <td>
                { fromSats(_chain.preconverted) }
              </td>
            </tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export const reserveChainInfoTableRender = function(chain) {
  const _currencyState = chain.bestcurrencystate
  const _chain = chain.chaindefinition ? chain.chaindefinition : chain

  return (
    <div>
      <div className="table-responsive chain-info-table">
        <table className="table table-striped">
          <tbody>
            {_currencyState &&
              <React.Fragment>
                <tr>
                  <td>
                    { translate('PBAAS.INITIAL_RATIO') }
                    {<span>
                      <i
                        className="icon fa-question-circle settings-help"
                        data-html={ true }
                        data-for="initRatio"
                        data-tip={ translate(`PBAAS.INITIAL_RATIO_INFO`) }></i>
                      <ReactTooltip
                        id="initRatio"
                        effect="solid"
                        className="text-left" 
                        place="right" />
                    </span>}
                  </td>
                  <td>
                    { _currencyState.initialratio }
                  </td>
                </tr>
                <tr>
                  <td>
                    { translate('PBAAS.INITIAL_SUPPLY') }
                    {<span>
                      <i
                        className="icon fa-question-circle settings-help"
                        data-html={ true }
                        data-for="initSupply"
                        data-tip={ translate(`PBAAS.INITIAL_SUPPLY_INFO`) }></i>
                      <ReactTooltip
                        id="initSupply"
                        effect="solid"
                        className="text-left" 
                        place="right" />
                    </span>}
                  </td>
                  <td>
                    { _currencyState.initialsupply }
                  </td>
                </tr>
                <tr>
                  <td>
                    { translate('PBAAS.BEST_PRICE') }
                    {<span>
                      <i
                        className="icon fa-question-circle settings-help"
                        data-html={ true }
                        data-for="bestPrice"
                        data-tip={ translate(`PBAAS.BEST_PRICE_INFO`, PBAAS_ROOT_CHAIN) }></i>
                      <ReactTooltip
                        id="bestPrice"
                        effect="solid"
                        className="text-left" 
                        place="right" />
                    </span>}
                  </td>
                  <td>
                    { _currencyState.priceinreserve   + ' ' + PBAAS_ROOT_CHAIN + '/' + _chain.name}
                  </td>
                </tr>
                <tr>
                  <td>
                    { translate('PBAAS.RESERVE_SUPPLY') }
                    {<span>
                      <i
                        className="icon fa-question-circle settings-help"
                        data-html={ true }
                        data-for="reserveSupply"
                        data-tip={ translate(`PBAAS.RESERVE_SUPPLY_INFO`) }></i>
                      <ReactTooltip
                        id="reserveSupply"
                        effect="solid"
                        className="text-left" 
                        place="right" />
                    </span>}
                  </td>
                  <td>
                    { _currencyState.reserve }
                  </td>
                </tr>
                <tr>
                  <td>
                    { translate('PBAAS.SUPPLY') }
                    {<span>
                      <i
                        className="icon fa-question-circle settings-help"
                        data-html={ true }
                        data-for="supply"
                        data-tip={ translate(`PBAAS.SUPPLY_INFO`) }></i>
                      <ReactTooltip
                        id="supply"
                        effect="solid"
                        className="text-left" 
                        place="right" />
                    </span>}
                  </td>
                  <td>
                    { _currencyState.supply }
                  </td>
                </tr>
              </React.Fragment>
            }
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
            { translate('PBAAS.NODE_PAYMENT_ADDRESS') + ': ' + node.paymentaddress }
          </div>
        </div>
      )
    })
  )
}