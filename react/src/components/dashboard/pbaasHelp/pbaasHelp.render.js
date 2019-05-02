import React from 'react';
import translate from '../../../translate/translate';

export const PBaaSHelpRender = function() {
  return (
    <div className="col-xs-12 margin-top-15 backround-gray">
      <div className="col-xlg-12 col-lg-12 col-sm-12 col-xs-12">
        <div className="panel info-panel">
          <div className="panel-heading">
            <h3 className="panel-title">{ translate('PBAAS.PBAAS_LONG_NAME') }</h3>
          </div>
          <div className="panel-body container-fluid">
            <div className="font-weight-600">{ translate('PBAAS.CONFIRM_DATA') }</div>
            <div className="chain-info-description">{ translate('PBAAS.CONFIRM_DATA_DESC') }</div>
          </div>
        </div>
      </div>
    </div>
  );
}


