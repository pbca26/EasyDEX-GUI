import React from 'react';
import translate from '../../../../translate/translate';
import { QUICK_CONVERT, CONTROL_CENTER } from '../../../../util/constants'

const PBaaSConvertNavRender = function() {
  return (
    <div className="navbar navbar-default bottom-navbar">
      <div className="container-fluid">
        <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
          <ul className="nav navbar-nav convert-navbar-container">
            <li className={ `convert-navbar-item ${this.isSectionActive(QUICK_CONVERT) ? "active" : ""}` }>
              <a onClick={ () => this.changeActiveSection(QUICK_CONVERT) }>
                <span className="glyphicon glyphicon-plane" aria-hidden="true"/> 
                { ' ' + translate('PBAAS.QUICK_CONVERT') }
              </a>
            </li>
            <li className={ `convert-navbar-item ${this.isSectionActive(CONTROL_CENTER) ? "active" : ""}` }>
              <a onClick={ () => this.changeActiveSection(CONTROL_CENTER) }>
                <span className="glyphicon glyphicon-dashboard" aria-hidden="true"/> 
                { ' ' + translate('PBAAS.CONTROL_CENTER') }
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PBaaSConvertNavRender;