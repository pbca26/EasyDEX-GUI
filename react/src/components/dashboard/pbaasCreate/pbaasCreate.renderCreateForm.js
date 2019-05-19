import React from 'react';
import translate from '../../../translate/translate';
import mainWindow from '../../../util/mainWindow';
import ReactTooltip from 'react-tooltip';
import Config from '../../../config';
import Plot from 'react-plotly.js';
import Select from 'react-select';

const EXPONENTIAL = 'exponential'
const LINEAR = 'linear'

export const _nameFormRender = function() {
  return (
    <div className="row">
      <div className="col-xlg-12 form-group form-material">
        <div className="font-weight-600">{ translate('PBAAS.CREATE_CHAIN') }</div>
        <div className="create-form-description">{ translate('PBAAS.CREATE_CHAIN_DESC') }</div>
        <div className="create-form-description font-weight-600">{ translate('PBAAS.FORM_COIN_WARNING') }</div>
        <div className="font-weight-600">{ translate('PBAAS.CHAIN_ID') }</div>
        <div className="create-form-description">{ translate('PBAAS.CHAIN_ID_DESC') }</div>
        <label
          className="control-label">
          { translate('PBAAS.CHAIN_NAME') }
        </label>
        <input
          type="text"
          className={ 'form-control' }
          name="chainName"
          onChange={ this.updateChainName }
          value={ this.state.chainName }
          id="pbaasChainName"
          placeholder={ translate('PBAAS.CHAIN_NAME_HOLDER') }
          autoComplete="off"
          required />
      </div>
    </div>
  )
}

export const _launchFormRender = function() {
  return (
    <div className="row">
      <div className="col-xlg-12 form-group form-material">
        <div className="font-weight-600">{ translate('PBAAS.PREMINE') }</div>
        <div className="create-form-description">{ translate('PBAAS.PREMINE_DESC') }</div>
        <span className="pointer">
          <label className="switch">
            <input
              type="checkbox"
              checked={ this.state.includePremine }
              readOnly />
            <div
              className="slider"
              onClick={ this.togglePremine.bind(this) }></div>
          </label>
          <div
            className="toggle-label"
            onClick={ this.togglePremine.bind(this) }>
            { translate('PBAAS.INCLUDE_PREMINE') }
          </div>
        </span>

        {this.state.includePremine &&
          <div>
            <div className="margin-bottom-15">
              <label
              className="control-label">
              { translate('PBAAS.PREMINE_ADDRESS') }
              </label>
              <input
                type="text"
                className={ 'form-control' }
                name="premineAddr"
                onChange={ this.updateAddressInput }
                value={ this.state.premineAddr }
                id="pbaasPremineAddr"
                placeholder={ translate('PBAAS.PREMINE_ADDRESS_HOLDER') }
                autoComplete="off"
                required />
              { this.state.errors.premineAddr && 
              <label
                className="control-label error-text">
                { translate('PBAAS.INVALID_ADDRESS') }
              </label> }
            </div>

            <div className="margin-bottom-10">
              <label
              className="control-label">
              { translate('PBAAS.PREMINE_AMOUNT') }
              </label>
              <input
                type="text"
                className={ 'form-control' }
                name="premineAmount"
                onChange={ this.updateAmountInput }
                value={ this.state.premineAmount }
                id="pbaasPremineAmount"
                placeholder={ translate('PBAAS.PREMINE_AMOUNT_HOLDER') }
                autoComplete="off"
                required />
              { this.state.errors.premineAmount && 
              <label
                className="control-label error-text">
                { translate('PBAAS.INVALID_AMOUNT') }
              </label> }
            </div>

            <span className="pointer">
              <label className="switch">
                <input
                  type="checkbox"
                  checked={ this.state.publicPremine }
                  readOnly />
                <div
                  className="slider"
                  onClick={ () => {return 0}/*this.togglePublicPremine.bind(this)*/ }></div>
              </label>
              <div
                className="toggle-label"
                onClick={ () => {return 0}/*this.togglePublicPremine.bind(this)*/ }>
                { translate('PBAAS.PUBLIC_PREMINE') }
              </div>
            </span>
            {this.state.publicPremine && 
              <div>
                <div>
                  <label
                  className="control-label">
                  { translate('PBAAS.CONVERTIBLE_AMOUNT') }
                  </label>
                  <input
                    type="text"
                    className={ 'form-control' }
                    name="convertible"
                    onChange={ this.updateAmountInput }
                    value={ this.state.convertible }
                    id="pbaasConvertible"
                    placeholder={ translate('PBAAS.CONVERTIBLE_AMOUNT_HOLDER') }
                    autoComplete="off"
                    required />
                  { this.state.errors.convertible && 
                  <label
                    className="control-label error-text">
                    { translate('PBAAS.INVALID_AMOUNT') }
                  </label> }
                </div>
                <div className="margin-bottom-10 margin-top-10">
                  <label
                  className="control-label">
                  { translate('PBAAS.LAUNCH_FEE') }
                  </label>
                  <input
                    type="text"
                    className={ 'form-control' }
                    name="launchfee"
                    onChange={ this.updateAmountInput }
                    value={ this.state.convertible }
                    id="pbaasLaunchfee"
                    placeholder={ translate('PBAAS.LAUNCH_FEE_HOLDER') }
                    autoComplete="off"
                    required />
                  { this.state.errors.launchfee && 
                  <label
                    className="control-label error-text">
                    { translate('PBAAS.INVALID_AMOUNT') }
                  </label> }
                </div>
              </div>
            }
          </div>
        }

        <div className="font-weight-600 margin-top-10">{ translate('PBAAS.LAUNCH') }</div>
        <div className="create-form-description">{ translate('PBAAS.LAUNCH_OPTIONS_DESC') }</div>
        
        <div>
          <label
          className="control-label">
          { translate('PBAAS.START_BLOCK') }
          </label>
          <input
            type="text"
            className={ 'form-control' }
            name="startBlock"
            onChange={ this.updateBlockInput }
            value={ this.state.startBlock }
            id="pbaasStartBlock"
            placeholder={ translate('PBAAS.START_BLOCK_HOLDER') }
            autoComplete="off"
            required />
          { this.state.errors.startBlock && 
          <label
            className="control-label error-text">
            { translate('PBAAS.INVALID_BLOCK') }
          </label> }
        </div>

      </div>
    </div>
  )
}

export const _rewardFormRender = function() {
  return (
    <div>
      <div className="font-weight-600">{ translate('PBAAS.REWARD_ERAS') }</div>
      <div className="create-form-description">{ translate('PBAAS.REWARD_ERAS_DESC') }</div>
      <button
        type="button"
        className="btn btn-success waves-effect waves-light"
        onClick={ this.addEra.bind(this) }
        disabled={ this.state.rewardEras.length >= 3 }>
        { translate('PBAAS.ADD_ERA') }
      </button>
      { this.renderEraCapsules() }
      { this.state.rewardEras.length > 0 &&
        <div>
          <button
            type="button"
            className="btn btn-success waves-effect waves-light margin-top-20"
            onClick={ this.calculatePlotData.bind(this) }
            data-tip={ translate('PBAAS.VISUALIZE_DESC') }
            disabled={ !this.rewardFormComplete() }
            >
            { translate('PBAAS.VISUALIZE') }
          </button>
          <ReactTooltip
          effect="solid"
          className="text-left" />
        </div>
      }
      {
        this.state.plotData.length > 0 && this.state.rewardEras.length > 0 &&
        <div className={ "era-plot-container" }>
          <Plot
            className={ "era-plot" }
            data={ this.state.plotData }
            layout={{
              title: 'Era Plot',
              xaxis: {
                range: [
                  0, this.state.plotData[this.state.plotData.length - 1].x[this.state.plotData[this.state.plotData.length - 1].x.length - 1]
                  - 1],
                autorange: false
              },
            }}
          />
        </div>
      }
    </div>
  )
}

export const _renderEraCapsules = function() {
  const ERA_VALUES = [
    {value: EXPONENTIAL, label: translate('PBAAS.TRADITIONAL'), key: "exp"},
    {value: LINEAR, label: translate('PBAAS.LINEAR'), key: "lin"},
  ]

  const ERA_VALUES_LAST_ERA = [
    {value: EXPONENTIAL, label: translate('PBAAS.TRADITIONAL'), key: "exp"},
  ]
  const _rewardEras = this.state.rewardEras

  return (
    <div className="era-capsule-container">
      {_rewardEras.map((rewardEra, index) => {
        return (
          <div className={rewardEra.hidden ? "hide" : "era-capsule"}>
            <div className="capsule-title">
              { translate('PBAAS.ERA') + ' ' + (index + 1)}
              <i 
                onClick={ () => this.removeEra(index) }
                className="fa fa-times" 
              ></i>
            </div>
            <div>
              <label
                className="control-label">
                { translate('PBAAS.INITIAL_REWARD') }
              </label>
              <input
                type="number"
                className={ 'form-control' }
                name={ "initReward-" + index }
                onChange={ this.updateEraCapsuleData }
                value={ rewardEra.initReward }
                id="pbaasInitReward"
                placeholder={ translate('PBAAS.INITIAL_REWARD_HOLDER') }
                autoComplete="off"
                required />
            </div>
            { this.state.rewardEras[index].errors.initReward && 
              <label
                className="control-label error-text">
                { translate('PBAAS.INVALID_INITREWARD') }
              </label>}
            <div>
              <label
                className="control-label margin-top-10">
                { translate('PBAAS.REWARD_DECAY_TYPE') }
              </label>
              <Select
                value={ rewardEra.decay.type }
                onChange={ (event) => this.updateDecayType(event, index) }
                options={ index < _rewardEras.length - 1 ? ERA_VALUES : ERA_VALUES_LAST_ERA }
              />
            </div>

            {rewardEra.decay.type === EXPONENTIAL && 
              <div>
                <div>
                  <label
                  className="control-label margin-top-10">
                  { translate('PBAAS.FREQUENCY') }
                  </label>
                  <input
                    type="number"
                    className={ 'form-control' }
                    name={ "decay.halving-" + index }
                    onChange={ this.updateEraCapsuleData }
                    value={ rewardEra.decay.halving }
                    id="pbaasHalving"
                    placeholder={ translate('PBAAS.FREQUENCY_HOLDER') }
                    autoComplete="off"
                    required />
                </div>
                { this.state.rewardEras[index].errors.halving && 
                <label
                  className="control-label error-text">
                  { translate('PBAAS.INVALID_FREQUENCY') }
                </label>}
                <div>
                  <label
                  className="control-label margin-top-10">
                  { translate('PBAAS.MAGNITUDE') }
                  </label>
                  <input
                    type="number"
                    className={ 'form-control' }
                    name={ "decay.magnitude-" + index }
                    onChange={ this.updateEraCapsuleData }
                    value={ rewardEra.decay.magnitude }
                    id="pbaasMagnitude"
                    placeholder={ translate('PBAAS.MAGNITUDE_HOLDER') }
                    autoComplete="off"
                    required />
                </div>
                { this.state.rewardEras[index].errors.magnitude && 
                <label
                  className="control-label error-text">
                  { translate('PBAAS.INVALID_MAGNITUDE') }
                </label>}
              </div>
            }

            {index < _rewardEras.length - 1 && 
              <div>
                <div>
                  <label
                  className="control-label margin-top-10">
                  { translate('PBAAS.END_BLOCK') }
                  </label>
                  <input
                    type="number"
                    className={ 'form-control' }
                    name={ "end-" + index }
                    onChange={ this.updateEraCapsuleData }
                    value={ rewardEra.end }
                    id="pbaasEndBlock"
                    placeholder={ translate('PBAAS.END_BLOCK_HOLDER') }
                    autoComplete="off"
                    required />
                </div>
                { this.state.rewardEras[index].errors.end && 
                <label
                  className="control-label error-text">
                  { translate('PBAAS.INVALID_END') }
                </label>}
              </div>
            }
          </div>
        )
      })}
    </div>
  )
}

export const _billingFormRender = function() {
  return (
    <div className="row">
      <div className="col-xlg-12 form-group form-material">
        <div className="font-weight-600">{ translate('PBAAS.COST_STRUCTURE') }</div>
        <div className="create-form-description">{ translate('PBAAS.COST_STRUCTURE_DESC') }</div>
        <div>
          <label
            className="control-label">
            { translate('PBAAS.INITIAL_NOTARIZATION_OFFER') }
          </label>
          <input
            type="text"
            className={ 'form-control' }
            name="initCost"
            onChange={ this.updateAmountInput }
            value={ this.state.initCost }
            id="pbaasInitCost"
            placeholder={ translate('PBAAS.INITIAL_NOTARIZATION_OFFER_HOLDER') }
            autoComplete="off"
            required />
          { this.state.errors.initCost && 
          <label
            className="control-label error-text">
            { translate('PBAAS.INVALID_AMOUNT') }
          </label>}
        </div>
        <div>
          <label
            className="control-label margin-top-10">
            { translate('PBAAS.BILLING_PERIOD') }
          </label>
          <input
            type="text"
            className={ 'form-control' }
            name="billingPeriod"
            onChange={ this.updateBillingPeriod }
            value={ this.state.billingPeriod }
            id="pbaasBillingPeriod"
            placeholder={ translate('PBAAS.BILLING_PERIOD_HOLDER') }
            autoComplete="off"
            required />
          { this.state.errors.billingPeriod && 
            <label
              className="control-label error-text">
              { translate('PBAAS.INVALID_BILLING_PERIOD') }
            </label>}
        </div>
      </div>
    </div>
  )
}

export const _nodesFormRender = function() {
  return (
    <div>
      <div className="font-weight-600">{ translate('PBAAS.BOOTSTRAP_NODES') }</div>
      <div className="create-form-description">{ translate('PBAAS.BOOTSTRAP_NODES_DESC') }</div>
      <div className="create-form-description font-weight-600">{ translate('PBAAS.BOOTSTRAP_NODES') }</div>
      <button
        type="button"
        className="btn btn-success waves-effect waves-light"
        onClick={ this.addNode.bind(this) }
        disabled={ this.state.nodes.length >= 2 }>
        { translate('PBAAS.ADD_NODE') }
      </button>
      { this.renderNodeCapsules() }
    </div>
  )
}

export const _renderNodeCapsules = function() {
  const _nodes = this.state.nodes

  return (
    <div className="era-capsule-container">
      {_nodes.map((node, index) => {
        return (
          <div className="era-capsule">
            <div className="capsule-title">
              { translate('PBAAS.NODE') + ' ' + (index + 1)}
              <i 
                onClick={ () => this.removeNode(index) }
                className="fa fa-times" 
              ></i>
            </div>

            <div>
              <label
                className="control-label">
                { translate('PBAAS.NODE_ADDRESS') }
              </label>
              <input
                type="text"
                className="form-control"
                name={ "nodeAddress-" + index }
                onChange={ this.updateNodeCapsuleData }
                value={ node.nodeAddress }
                id="pbaasNodeAddress"
                placeholder={ translate('PBAAS.NODE_ADDRESS_HOLDER') }
                autoComplete="off"
                required />
              { this.state.nodes[index].errors.nodeAddress && 
              <label
                className="control-label error-text">
                { translate('PBAAS.INVAID_IP') }
              </label>}
            </div>

            <div>
              <label
              className="control-label margin-top-10">
              { translate('PBAAS.PAYMENT_ADDRESS') }
              </label>
              <input
                type="text"
                className={ 'form-control' }
                name={ "paymentAddress-" + index }
                onChange={ this.updateNodeCapsuleData }
                value={ node.paymentAddress }
                id="pbaasPaymentAddress"
                placeholder={ translate('PBAAS.PAYMENT_ADDRESS_HOLDER') }
                autoComplete="off"
                required />
              { this.state.nodes[index].errors.paymentAddress && 
              <label
                className="control-label error-text">
                { translate('PBAAS.INVALID_ADDRESS') }
              </label>}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export const _confirmErasRender = function() {
  return (
    this.state.rewardEras.map((rewardEra, index) => {
      return (
        <div className="confirm-era-capsule">
          <div className="capsule-title">{ translate('PBAAS.ERA') + ' ' + (index + 1)}</div>
          <div>
            { translate('PBAAS.INITIAL_REWARD') + ': ' }
            {rewardEra.initReward.length > 0 && !rewardEra.errors.initReward ?
                rewardEra.initReward
                :
                <span>
                  <i
                    className="icon fa-warning color-warning margin-right-5"
                    data-tip={ rewardEra.errors.initReward ? translate('PBAAS.INVALID_INFO') : translate('PBAAS.REQUIRED_FIELD') }
                    data-for="chainNameError"></i>
                  <ReactTooltip
                    id="chainNameError"
                    effect="solid"
                    className="text-left" />
                </span> 
              }
          </div>
          <div>
            { translate('PBAAS.REWARD_DECAY_TYPE') + ': ' + rewardEra.decay.type}
          </div>
          <div className={ rewardEra.decay.type === LINEAR ? 'hide' : ''}>
            { translate('PBAAS.FREQUENCY') + ': ' }
            {rewardEra.decay.halving.length > 0 && !rewardEra.errors.halving ?
                rewardEra.decay.halving
                :
                <span>
                  <i
                    className="icon fa-warning color-warning margin-right-5"
                    data-tip={ rewardEra.errors.halving ? translate('PBAAS.INVALID_INFO') : translate('PBAAS.REQUIRED_FIELD_CONDITIONAL') }
                    data-for="chainNameError"></i>
                  <ReactTooltip
                    id="chainNameError"
                    effect="solid"
                    className="text-left" />
                </span> 
              }
          </div>
          <div className={ rewardEra.decay.type === LINEAR ? 'hide' : ''}>
            { translate('PBAAS.MAGNITUDE') + ': ' }
            {rewardEra.decay.magnitude.length > 0 && !rewardEra.errors.magnitude ?
                rewardEra.decay.magnitude
                :
                <span>
                  <i
                    className="icon fa-warning color-warning margin-right-5"
                    data-tip={ rewardEra.errors.magnitude ? translate('PBAAS.INVALID_INFO') : translate('PBAAS.REQUIRED_FIELD_CONDITIONAL') }
                    data-for="chainNameError"></i>
                  <ReactTooltip
                    id="chainNameError"
                    effect="solid"
                    className="text-left" />
                </span> 
              }
          </div>
          <div className={ !(index < this.state.rewardEras.length - 1) ? 'hide' : ''}>
            { translate('PBAAS.END_BLOCK') + ': ' }
            {rewardEra.end.length > 0 && !rewardEra.errors.end ?
                rewardEra.end
                :
                <span>
                  <i
                    className="icon fa-warning color-warning margin-right-5"
                    data-tip={ rewardEra.errors.end ? translate('PBAAS.INVALID_INFO') : translate('PBAAS.REQUIRED_FIELD') }
                    data-for="chainNameError"></i>
                  <ReactTooltip
                    id="chainNameError"
                    effect="solid"
                    className="text-left" />
                </span> 
              }
          </div>
        </div>
      )
    })
  )
}

export const _confirmNodesRender = function() {
  return (
    this.state.nodes.map((node, index) => {
      return (
        <div className="confirm-era-capsule">
          <div className="capsule-title">{ translate('PBAAS.NODE') + ' ' + (index + 1)}</div>
          <div>
            { translate('PBAAS.NODE_ADDRESS') + ': ' }
            {node.nodeAddress.length > 0 && !node.errors.nodeAddress ?
                node.nodeAddress
                :
                <span>
                  <i
                    className="icon fa-warning color-warning margin-right-5"
                    data-tip={ node.errors.nodeAddress ? translate('PBAAS.INVALID_INFO') : translate('PBAAS.REQUIRED_FIELD') }
                    data-for="chainNameError"></i>
                  <ReactTooltip
                    id="chainNameError"
                    effect="solid"
                    className="text-left" />
                </span> 
              }
          </div>
          <div>
            { translate('PBAAS.PAYMENT_ADDRESS') + ': ' }
            {node.paymentAddress.length > 0 && !node.errors.paymentAddress ?
                node.paymentAddress
                :
                <span>
                  <i
                    className="icon fa-warning color-warning margin-right-5"
                    data-tip={ node.errors.paymentAddress ? translate('PBAAS.INVALID_INFO') : translate('PBAAS.REQUIRED_FIELD') }
                    data-for="chainNameError"></i>
                  <ReactTooltip
                    id="chainNameError"
                    effect="solid"
                    className="text-left" />
                </span> 
              }
          </div>
        </div>
      )
    })
  )
}

export const _confirmFormRender = function() {
  return (
    <div>
      <div className="font-weight-600">{ translate('PBAAS.CONFIRM_DATA') }</div>
      <div className="create-form-description">{ translate('PBAAS.CONFIRM_DATA_DESC') }</div>
      <div className="table-responsive">
        <table className="table table-striped">
          <tbody>
            <tr>
              <td>{ translate('PBAAS.NAME') }</td>
              <td>
                {this.state.chainName.length > 0 && !this.state.errors.chainName ?
                  this.state.chainName
                  :
                  <span>
                    <i
                      className="icon fa-warning color-warning margin-right-5"
                      data-tip={ this.state.errors.chainName ? translate('PBAAS.INVALID_INFO') : translate('PBAAS.REQUIRED_FIELD') }
                      data-for="chainNameError"></i>
                    <ReactTooltip
                      id="chainNameError"
                      effect="solid"
                      className="text-left" />
                  </span> 
                }
              </td>
            </tr>
            <tr>
              <td>{ translate('PBAAS.PREMINE_QUESTION') }</td>
              <td>
                {this.state.includePremine ? translate('SETTINGS.YES') : translate('SETTINGS.NO') }
              </td>
            </tr>
            <tr>
              <td>{ translate('PBAAS.PUBLIC_PREMINE_QUESTION') }</td>
              <td>
                {this.state.publicPremine && this.state.includePremine ? translate('SETTINGS.YES') : translate('SETTINGS.NO') }
              </td>
            </tr>

            {this.state.includePremine && 
              <tr>
                <td>{ translate('PBAAS.PREMINE_ADDRESS') }</td>
                <td>
                  {this.state.premineAddr.length > 0 && !this.state.errors.premineAddr ?
                    this.state.premineAddr
                    :
                    <span>
                      <i
                        className="icon fa-warning color-warning margin-right-5"
                        data-tip={ this.state.errors.premineAddr ? translate('PBAAS.INVALID_INFO') : translate('PBAAS.REQUIRED_FIELD_CONDITIONAL') }
                        data-for="premineAddrError"></i>
                      <ReactTooltip
                        id="premineAddrError"
                        effect="solid"
                        className="text-left" />
                    </span> 
                  }
                </td>
              </tr>
            }

            {this.state.includePremine && 
              <tr>
                <td>{ translate('PBAAS.PREMINE_AMOUNT') }</td>
                <td>
                  {this.state.premineAmount.length > 0 && !this.state.errors.premineAmount ?
                      this.state.premineAmount
                      :
                      <span>
                        <i
                          className="icon fa-warning color-warning margin-right-5"
                          data-tip={ this.state.errors.premineAmount ? translate('PBAAS.INVALID_INFO') : translate('PBAAS.REQUIRED_FIELD_CONDITIONAL') }
                          data-for="premineAddrError"></i>
                        <ReactTooltip
                          id="premineAddrError"
                          effect="solid"
                          className="text-left" />
                      </span> 
                  }
                </td>
              </tr>
            }

            {this.state.publicPremine && this.state.includePremine &&
              <tr>
                <td>{ translate('PBAAS.CONVERTIBLE_AMOUNT') }</td>
                <td>
                  {this.state.convertible.length > 0 && !this.state.errors.convertible ?
                      this.state.convertible
                      :
                      <span>
                        <i
                          className="icon fa-warning color-warning margin-right-5"
                          data-tip={ this.state.errors.convertible ? translate('PBAAS.INVALID_INFO') : translate('PBAAS.REQUIRED_FIELD_CONDITIONAL') }
                          data-for="premineAddrError"></i>
                        <ReactTooltip
                          id="premineAddrError"
                          effect="solid"
                          className="text-left" />
                      </span> 
                    }
                </td>
              </tr>
            }

            <tr>
              <td>{ translate('PBAAS.START_BLOCK') }</td>
              <td>
                {this.state.startBlock.length > 0 && !this.state.errors.startBlock ?
                    this.state.startBlock
                    :
                    <span>
                      <i
                        className="icon fa-warning color-warning margin-right-5"
                        data-tip={ this.state.errors.startBlock ? translate('PBAAS.INVALID_INFO') : translate('PBAAS.REQUIRED_FIELD_CONDITIONAL') }
                        data-for="premineAddrError"></i>
                      <ReactTooltip
                        id="premineAddrError"
                        effect="solid"
                        className="text-left" />
                    </span> 
                  }
              </td>
            </tr>
            <tr>
              <td>{ translate('PBAAS.NUMBER_OF_ERAS') }</td>
              <td>
                { this.state.rewardEras.length }
              </td>
            </tr>
            <tr>
              <td>{ translate('PBAAS.REWARD_ERAS') }</td>
              <td>
                <div className={ "era-capsule-container" }>
                  {this.state.rewardEras.length > 0 ?
                    this.confirmErasRender()
                    :
                    <span>
                      <i
                        className="icon fa-warning color-warning margin-right-5"
                        data-tip={ translate('PBAAS.REQUIRED_FIELD') }
                        data-for="premineAddrError"></i>
                      <ReactTooltip
                        id="premineAddrError"
                        effect="solid"
                        className="text-left" />
                    </span> 
                  }
                </div>
              </td>
            </tr>
            <tr>
              <td>{ translate('PBAAS.INITIAL_NOTARIZATION_OFFER') }</td>
              <td>
                {this.state.initCost.length > 0 && !this.state.errors.initCost ?
                  this.state.initCost
                  :
                  <span>
                    <i
                      className="icon fa-warning color-warning margin-right-5"
                      data-tip={ this.state.errors.initCost ? translate('PBAAS.INVALID_INFO') : translate('PBAAS.REQUIRED_FIELD') }
                      data-for="premineAddrError"></i>
                    <ReactTooltip
                      id="premineAddrError"
                      effect="solid"
                      className="text-left" />
                  </span> 
                }
              </td>
            </tr>
            <tr>
              <td>{ translate('PBAAS.BILLING_PERIOD') }</td>
              <td>
                {this.state.billingPeriod.length > 0 && !this.state.errors.billingPeriod ?
                  this.state.billingPeriod
                  :
                  <span>
                    <i
                      className="icon fa-warning color-warning margin-right-5"
                      data-tip={ this.state.errors.billingPeriod ? translate('PBAAS.INVALID_INFO') : translate('PBAAS.REQUIRED_FIELD') }
                      data-for="premineAddrError"></i>
                    <ReactTooltip
                      id="premineAddrError"
                      effect="solid"
                      className="text-left" />
                  </span> 
                }
              </td>
            </tr>
            <tr>
              <td>{ translate('PBAAS.NUMBER_OF_NODES') }</td>
              <td>
                { this.state.nodes.length }
              </td>
            </tr>
            <tr>
              <td>{ translate('PBAAS.BOOTSTRAP_NODES') }</td>
              <td>
                <div className={ "era-capsule-container" }>
                  {this.state.nodes.length > 0 ?
                    this.confirmNodesRender()
                    :
                    <span>
                      <i
                        className="icon fa-warning color-warning margin-right-5"
                        data-tip={ translate('PBAAS.REQUIRED_FIELD') }
                        data-for="premineAddrError"></i>
                      <ReactTooltip
                        id="premineAddrError"
                        effect="solid"
                        className="text-left" />
                    </span> 
                  }
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
