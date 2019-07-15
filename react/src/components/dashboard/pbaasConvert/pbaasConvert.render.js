import React from 'react';
import translate from '../../../translate/translate';
import PBaaSConvertNav from './pbaasConvertNav/pbaasConvertNav'

export const PBaaSConvertRender = function() {
  return (
    <div className="col-xs-12 margin-top-15 backround-gray">
      <div> Convert screen goes here </div>
      <div className="convert-nav-box">
        <PBaaSConvertNav />
      </div>
    </div>
  );
}


