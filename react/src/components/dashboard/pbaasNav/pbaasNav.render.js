import React from 'react';
import translate from '../../../translate/translate';
import mainWindow from '../../../util/mainWindow';
import ReactTooltip from 'react-tooltip';
import Config from '../../../config';
import {
  CONNECT,
  CREATE,
  DISCOVER,
  CONVERT
} from '../../../util/constants'

const PBaaSNavRender = function() {
  return (
    <div className="navbar navbar-default">
      <div className="container-fluid">
        <div className="navbar-header">
          <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
          <a className="navbar-brand" href="#">PBaaS</a>
        </div>
        <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
          <ul className="nav navbar-nav">
            <li className={ this.isSectionActive(CONNECT) ? "active" : "" }>
              <a onClick={ () => this.changeActiveSection(CONNECT) }>
                <span className="glyphicon glyphicon-map-marker" aria-hidden="true"/> 
                { ' ' + translate('PBAAS.CONNECT') }
              </a>
            </li>
            {<li className={ this.isSectionActive(DISCOVER) ? "active" : "" }>
              <a onClick={ () => this.changeActiveSection(DISCOVER) }>
                <span className="glyphicon glyphicon-globe" aria-hidden="true"/> 
                { ' ' + translate('PBAAS.DISCOVER') }
              </a>
            </li>}
            <li className={ this.isSectionActive(CREATE) ? "active" : "" }>
              <a onClick={ () => this.changeActiveSection(CREATE) }>
                <span className="glyphicon glyphicon-wrench" aria-hidden="true"/>
                { ' ' + translate('PBAAS.CREATE') }
              </a>
            </li>
            <li className={ this.isSectionActive(CONVERT) ? "active" : "" }>
              <a onClick={ () => this.changeActiveSection(CONVERT) }>
                <span className="glyphicon glyphicon-transfer" aria-hidden="true"/>
                { ' ' + translate('PBAAS.CONVERT') }
              </a>
            </li>
            {/*<li className={ this.isSectionActive(HELP) ? "active" : "" }>
              <a onClick={ () => this.changeActiveSection(HELP) }>
                <span className="glyphicon glyphicon-question-sign" aria-hidden="true"/>
                { ' ' + translate('PBAAS.HELP') }
              </a>
            </li>*/}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PBaaSNavRender;