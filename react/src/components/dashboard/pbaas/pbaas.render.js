import React from 'react';
import translate from '../../../translate/translate';
import mainWindow from '../../../util/mainWindow';
import ReactTooltip from 'react-tooltip';
import Config from '../../../config';
import PBaaSNav from '../pbaasNav/pbaasNav';
import PBaaSConnect from '../pbaasConnect/pbaasConnect';
import PBaasCreate from '../pbaasCreate/pbaasCreate';

const PBaaSRender = function() {
  return (
    <div className={ 'full-height' }>
      <div
        className={ 'page-main page-main-pbaas navbar-collapse' }
        id="pbaas-dashboard">
        <PBaaSNav/>
        <div className={ this.isSectionActive('connect') ? '' : 'hide' }>
          <PBaaSConnect/>
        </div>
        { this.isSectionActive('create') &&
          <div>
            <PBaasCreate />
          </div>
         }
      </div>
    </div>
  );
};

export default PBaaSRender;