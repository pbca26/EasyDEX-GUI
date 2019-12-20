import React from 'react';
import ReactTooltip from 'react-tooltip';
import translate from '../../../translate/translate';

const PbaasConvertBalanceRender = function() {
  return (
    <div
      id="wallet-widgets"
      className="wallet-widgets">
        <div className="widgets-container">

          <div className={ 'col-lg-4 col-xs-12 widget-box' }>
            <div className="widget widget-shadow">
              <div className="padding-10 padding-top-10">
                <div className="clearfix cursor-default">
                  <div className="pull-left padding-vertical-10 min-width-160l">
                    <i className="icon fa-eye-slash font-size-24 vertical-align-bottom margin-right-5"></i>
                    { translate('PBAAS.NATIVE_BALANCE') }
                  </div>
                  <span
                    className="pull-right padding-top-10 font-size-20 balance-text"
                    data-tip={ '2500' }>
                    { '2500' }
                  </span>
                  <ReactTooltip
                    effect="solid"
                    className="text-left" />
                </div>
              </div>
            </div>
          </div>

          <div className={ 'col-lg-4 col-xs-12 widget-box' }>
            <div className="widget widget-shadow">
              <div className="padding-10 padding-top-10">
                <div className="clearfix cursor-default">
                  <div className="pull-left padding-vertical-10 min-width-160l">
                    <i className="icon fa-eye-slash font-size-24 vertical-align-bottom margin-right-5"></i>
                    { translate('PBAAS.VRSC_TOKEN_BALANCE') }
                  </div>
                  <span
                    className="pull-right padding-top-10 font-size-20 balance-text"
                    data-tip={ '1000' }>
                    { '1000' }
                  </span>
                  <ReactTooltip
                    effect="solid"
                    className="text-left" />
                </div>
              </div>
            </div>
          </div>

        </div>
    </div>
  );
};

export default PbaasConvertBalanceRender;