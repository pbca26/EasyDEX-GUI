import React from 'react';
import translate from '../../../../translate/translate';
import Select from 'react-select'

export const _inputFormRender = function() {
  return (
    <div className="row">
      <div className="col-xlg-12 form-group form-material">
        <div className="quick-convert-main-container">
          <div className="quick-convert-sub-container">
            <div>
              <label
                className="control-label convert-coin-select-label">
                { translate('PBAAS.COIN_CONVERT_FROM') }
              </label>
              <Select
                name="selectedShortcutNative"
                value={ this.state.selectedFrom }
                onChange={  (newValue) => {this.updateSelectedFrom(newValue)} }
                optionRenderer={ this.renderCoinOption }
                valueRenderer={ this.renderCoinOption }
                options={[{label: 'VRSC'}]} />
            </div>
            <div className="convert-amount-textbox">
              <label
                className="control-label">
                { translate('PBAAS.AMOUNT_CONVERT_FROM') }
              </label>
              <input
                type="number"
                className={ 'form-control' }
                name={ "textFieldConvertFrom" }
                //onChange={ this.updateEraCapsuleData }
                //value={ rewardEra.initReward }
                id="convertFrom"
                placeholder={ 
                  this.state.selectedFrom ? 
                    translate('PBAAS.AMOUNT_CONVERT_FROM_HOLDER', this.state.selectedFrom.label)
                    :
                    translate('PBAAS.SELECT_CONVERT_COIN_FROM_HOLDER') }
                autoComplete="off"
                required />
            </div>
          </div>

          <div className="quick-convert-sub-container-center">
          
            <div className="convert-amount-textbox">
              <label
                className="control-label">
                { translate('PBAAS.AMOUNT_CONVERT_TO') }
              </label>
              <input
                type="number"
                className={ 'form-control width-200' }
                name={ "textFieldConvertTo" }
                onChange={ this.updateEraCapsuleData }
                value={ null }
                id="convertTo"
                disabled={true}
                placeholder={
                this.state.selectedFrom ? 
                  this.state.selectedTo ? 
                    `1 ${this.state.selectedFrom.label} =~ 0.5 ${this.state.selectedTo.label}`
                    :
                    translate('PBAAS.SELECT_CONVERT_COIN_TO_HOLDER')
                  :
                  translate('PBAAS.SELECT_CONVERT_COIN_FROM_HOLDER')
                }
                autoComplete="off"
                required />
            </div>
            <div>
              <button
                onClick={ () => {return 0} }
                className="btn btn-primary waves-effect waves-light width-200">
                {translate('PBAAS.CONVERT')}
              </button>
            </div>
          </div>

          <div className="quick-convert-sub-container">
            <div>
              <label
                className="control-label convert-coin-select-label">
                { translate('PBAAS.COIN_CONVERT_TO') }
              </label>
              <Select
                name="selectedShortcutNative"
                value={ this.state.selectedTo }
                onChange={ (newValue) => {this.updateSelectedTo(newValue)} }
                optionRenderer={ this.renderCoinOption }
                valueRenderer={ this.renderCoinOption }
                options={[{label: 'WHALECOIN'}]} />
            </div>
            <div className="convert-amount-textbox">
              <label
                className="control-label">
                { translate('PBAAS.AMOUNT_CONVERT_TO') }
              </label>
              <input
                type="number"
                className={ 'form-control' }
                name={ "textFieldConvertTo" }
                //onChange={ this.updateEraCapsuleData }
                //value={ rewardEra.initReward }
                id="convertTo"
                disabled={true}
                placeholder={ translate('PBAAS.AMOUNT_CONVERT_TO_HOLDER') }
                autoComplete="off"
                required />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const _confirmingFormRender = function() {
  return (
    <div className="row">
      <div className="col-xlg-12 form-group form-material">
        <div className="font-weight-600">{ translate('PBAAS.CREATE_CHAIN') }</div>
        <div className="create-form-description">{ translate('PBAAS.CREATE_CHAIN_DESC') }</div>
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
          onChange={ () => {return 0} }
          value={ () => {return 0} }
          id="placeholder"
          placeholder={ translate('PBAAS.CHAIN_NAME_HOLDER') }
          autoComplete="off"
          required />
      </div>
    </div>
  )
}

export const _processingFormRender = function() {
  return (
    <div className="row">
      <div className="col-xlg-12 form-group form-material">
        <div className="font-weight-600">{ translate('PBAAS.CREATE_CHAIN') }</div>
        <div className="create-form-description">{ translate('PBAAS.CREATE_CHAIN_DESC') }</div>
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
          onChange={ () => {return 0} }
          value={ () => {return 0} }
          id="placeholder"
          placeholder={ translate('PBAAS.CHAIN_NAME_HOLDER') }
          autoComplete="off"
          required />
      </div>
    </div>
  )
}
