import React from 'react';
import translate from '../../../translate/translate';
import PBaaSConvertNav from './pbaasConvertNav/pbaasConvertNav';
import PBaaSQuickConvert from './pbaasQuickConvert/pbaasQuickConvert';
import { QUICK_CONVERT, CONTROL_CENTER } from '../../../util/constants'

export const PBaaSConvertRender = function() {
  return (
    <div className="col-xs-12 margin-top-15 backround-gray">
      { this.isSectionActive(QUICK_CONVERT) &&
        <div>
          <PBaaSQuickConvert />
        </div> 
      }
      <div className="convert-nav-box">
        <PBaaSConvertNav />
      </div>
    </div>
  );
}


