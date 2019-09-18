import React from 'react'
import translate from '../../../../translate/translate';

const shieldCoinbaseFormRender = (self) => {
  return (
    <div className="row">
      <div className="col-xlg-12 form-group form-material">
        <label className="control-label padding-bottom-10">
          { translate('INDEX.SEND_TO') }
        </label>
        { self.renderShielCoinbaseAddressList() }
      </div>
      <div className="col-lg-12">
        <button
          type="button"
          className="btn btn-primary waves-effect waves-light pull-right"
          onClick={ self._shieldCoinbase }
          disabled={ !self.state.sendFrom }>
          { translate('INDEX.CONFIRM') }
        </button>
      </div>
    </div>
  )
}

export default shieldCoinbaseFormRender