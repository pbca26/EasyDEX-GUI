import React from 'react';
import translate from '../../../../translate/translate';
import { QUICK_CONVERT_FORM_TITLES } from '../../../../util/constants';

export const _formProgressRender = function() {
  const step = this.state.currentStep

  return (
    <div className="steps row margin-top-10">
      <div className={ 'step col-md-4' + (step === 0 ? ' current' : '') } onClick={ () => this.setCurrentStep(0) }>
        <span className="step-number">1</span>
        <div className="step-desc">
          <span className="step-title">{ translate(`PBAAS.${QUICK_CONVERT_FORM_TITLES[0]}`) }</span>
          <p>{ translate(`PBAAS.${QUICK_CONVERT_FORM_TITLES[0]}_DESC`) }</p>
        </div>
      </div>
      <div className={ 'step col-md-4' + (step === 1 ? ' current' : '') } onClick={ () => this.setCurrentStep(1) }>
        <span className="step-number">2</span>
        <div className="step-desc">
          <span className="step-title">{ translate(`PBAAS.${QUICK_CONVERT_FORM_TITLES[1]}`) }</span>
          <p>{ translate(`PBAAS.${QUICK_CONVERT_FORM_TITLES[1]}_DESC`) }</p>
        </div>
      </div>
      <div className={ 'step col-md-4' + (step === 2 ? ' current' : '') } onClick={ () => this.setCurrentStep(2) }>
        <span className="step-number">3</span>
        <div className="step-desc">
          <span className="step-title">{ translate(`PBAAS.${QUICK_CONVERT_FORM_TITLES[2]}`) }</span>
          <p>{ translate(`PBAAS.${QUICK_CONVERT_FORM_TITLES[2]}_DESC`) }</p>
        </div>
      </div>
    </div>
  );
}

export const PBaaSConversionCenterRender = function() {
  const step = this.state.currentStep

  return (
    <div className="col-xlg-12 col-md-12 col-sm-12 col-xs-12">
      { this.formProgressRender() }
      <div className="panel">
        <div className="panel-heading">
          <h3 className="panel-title">
            { step < QUICK_CONVERT_FORM_TITLES.length && step >= 0 ? translate(`PBAAS.${QUICK_CONVERT_FORM_TITLES[step]}`) : translate(`PBAAS.BROKE`) }
          </h3>
        </div>
        <div className="panel-body container-fluid">
          { this.state.currentStep === 0 && this.inputFormRender() }
          { this.state.currentStep === 1 && this.confirmingFormRender() }
          { this.state.currentStep === 2 && this.processingFormRender() }
          <div className="chain-options">
            <button
              type="button"
              className="btn btn-primary waves-effect waves-light"
              onClick={ this.decrementStep.bind(this) }>
              { translate('PBAAS.BACK') }
            </button>
            <button
              type="button"
              className="btn btn-success waves-effect waves-light"
              onClick={ this.incrementStep.bind(this) }
              disabled={ false }>
              { translate('PBAAS.NEXT') }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};