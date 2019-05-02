import React from 'react';
import translate from '../../../translate/translate';
import mainWindow from '../../../util/mainWindow';
import ReactTooltip from 'react-tooltip';
import Config from '../../../config';
import PBaaSNav from '../pbaasNav/pbaasNav';
import PBaaSConnect from '../pbaasConnect/pbaasConnect';
import PBaaSCreate from '../pbaasCreate/pbaasCreate';
import PBaaSDiscover from '../pbaasDiscover/pbaasDiscover';
import PBaaSHelp from '../pbaasHelp/pbaasHelp';

const PBaaSRender = function() {
  return (
    <div className={ 'full-height' }>
      <div
        //className={ 'page-main page-main-pbaas navbar-collapse' }
        id="pbaas-dashboard">
        <PBaaSNav/>
        <div className={ this.isSectionActive('connect') ? '' : 'hide' }>
          <PBaaSConnect/>
        </div>
        { this.isSectionActive('discover') &&
          <div>
            <PBaaSDiscover />
          </div>
        }
        { this.isSectionActive('create') &&
          <div>
            <PBaaSCreate />
          </div>
        }
        { this.isSectionActive('help') &&
          <div>
            <PBaaSHelp />
          </div>
        }
      </div>
    </div>
  );
};

export default PBaaSRender;