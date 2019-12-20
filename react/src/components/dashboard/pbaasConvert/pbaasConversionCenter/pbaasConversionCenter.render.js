import React from 'react';
import translate from '../../../../translate/translate';
import PbaasConvertBalance from '../../pbaasConvertBalance/pbaasConvertBalance'
import PbaasPriceData from '../../pbaasPriceData/pbaasPriceData'
import PbaasLimitHistory from '../../pbaasLimitHistory/pbaasLimitHistory'

export const PBaaSConversionCenterRender = function() {
  return (
    <div className="conversion-center-container">
      <PbaasConvertBalance/>
      <PbaasPriceData/>
      <PbaasLimitHistory/>
    </div>
  );
};