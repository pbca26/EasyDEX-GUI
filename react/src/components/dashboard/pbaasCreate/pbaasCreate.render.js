import React from 'react';
import translate from '../../../translate/translate';
import mainWindow from '../../../util/mainWindow';
import ReactTooltip from 'react-tooltip';
import Config from '../../../config';

const FORM_TITLES = ['NAME', 'LAUNCH', 'REWARD_STRUCTURE', 'BILLING', 'NODES', 'CONFIRM']

export const _formProgressRender = function() {
  const step = this.state.currentStep

  return (
    <div className="steps row margin-top-10">
      <div className={ 'step col-md-4' + (step === 0 ? ' current' : '') } onClick={ () => this.setCurrentStep(0) }>
        <span className="step-number">1</span>
        <div className="step-desc">
          <span className="step-title">{ translate(`PBAAS.${FORM_TITLES[0]}`) }</span>
          <p>{ translate(`PBAAS.${FORM_TITLES[0]}_DESC`) }</p>
        </div>
      </div>
      <div className={ 'step col-md-4' + (step === 1 ? ' current' : '') } onClick={ () => this.setCurrentStep(1) }>
        <span className="step-number">2</span>
        <div className="step-desc">
          <span className="step-title">{ translate(`PBAAS.${FORM_TITLES[1]}`) }</span>
          <p>{ translate(`PBAAS.${FORM_TITLES[1]}_DESC`) }</p>
        </div>
      </div>
      <div className={ 'step col-md-4' + (step === 2 ? ' current' : '') } onClick={ () => this.setCurrentStep(2) }>
        <span className="step-number">3</span>
        <div className="step-desc">
          <span className="step-title">{ translate(`PBAAS.${FORM_TITLES[2]}`) }</span>
          <p>{ translate(`PBAAS.${FORM_TITLES[2]}_DESC`) }</p>
        </div>
      </div>
      <div className={ 'step col-md-4' + (step === 3 ? ' current' : '') } onClick={ () => this.setCurrentStep(3) }>
        <span className="step-number">4</span>
        <div className="step-desc">
          <span className="step-title">{ translate(`PBAAS.${FORM_TITLES[3]}`) }</span>
          <p>{ translate(`PBAAS.${FORM_TITLES[3]}_DESC`) }</p>
        </div>
      </div>
      <div className={ 'step col-md-4' + (step === 4 ? ' current' : '') } onClick={ () => this.setCurrentStep(4) }>
        <span className="step-number">5</span>
        <div className="step-desc">
          <span className="step-title">{ translate(`PBAAS.${FORM_TITLES[4]}`) }</span>
          <p>{ translate(`PBAAS.${FORM_TITLES[4]}_DESC`) }</p>
        </div>
      </div>
      <div className={ 'step col-md-4' + (step === 5 ? ' current' : '') } onClick={ () => this.setCurrentStep(5) }>
        <span className="step-number">6</span>
        <div className="step-desc">
          <span className="step-title">{ translate(`PBAAS.${FORM_TITLES[5]}`) }</span>
          <p>{ translate(`PBAAS.${FORM_TITLES[5]}_DESC`) }</p>
        </div>
      </div>
    </div>
  );
}

export const PBaaSCreateRender = function() {
  const step = this.state.currentStep

  return (
    <div className="col-xlg-12 col-md-12 col-sm-12 col-xs-12">
      { this.formProgressRender() }
      <div className="panel">
        <div className="panel-heading">
          <h3 className="panel-title">
            { step < FORM_TITLES.length && step >= 0 ? translate(`PBAAS.${FORM_TITLES[step]}`) : translate(`PBAAS.BROKE`) }
          </h3>
        </div>
        <div className="panel-body container-fluid">
          { this.state.currentStep === 0 && this.nameFormRender() }
          { this.state.currentStep === 1 && this.launchFormRender() }
          { this.state.currentStep === 2 && this.rewardFormRender() }
          { this.state.currentStep === 3 && this.billingFormRender() }
          { this.state.currentStep === 4 && this.nodesFormRender() }
          { this.state.currentStep === 5 && this.confirmFormRender() }
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
              onClick={ this.state.currentStep === 5 ? this.parseState.bind(this) : this.incrementStep.bind(this) }
              disabled={ this.state.currentStep === 5 && this.anyErrorsOrIncomplete() }>
              { this.state.currentStep === 5 ? translate('PBAAS.CONFIRM') : translate('PBAAS.NEXT') }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};