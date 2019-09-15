import React from 'react';
import translate from '../../../translate/translate';
import PBaaSConvertNav from './pbaasConvertNav/pbaasConvertNav';
import PBaaSConversionCenter from './pbaasConversionCenter/pbaasConversionCenter';
import { QUICK_CONVERT, CONTROL_CENTER } from '../../../util/constants'

export const PBaaSConvertRender = function() {
  return (
    <div className="col-xs-12 margin-top-15 backround-gray">
      { this.isSectionActive(QUICK_CONVERT) &&
        <div>
          <PBaaSConversionCenter />
        </div> 
      }
      <div className="convert-nav-box">
        <PBaaSConvertNav />
      </div>
    </div>
  );
}


