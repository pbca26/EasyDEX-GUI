import React from 'react'
import translate from '../../../../translate/translate';

const kvSendFormRender = (self) => {
  return (
    <div className="row">
      {/*<button
        type="button"
        className="btn btn-default btn-send-self"
        onClick={ self.loadTestData }>
        Load test data
      </button>*/}
      <div className="col-xlg-12 form-group form-material">
        <label
          className="control-label"
          htmlFor="kvSendTag">
          { translate('KV.TAG') }
        </label>
        <input
          type="text"
          className="form-control"
          name="kvSendTag"
          onChange={ self.updateInput }
          value={ self.state.kvSendTag }
          id="kvSendTag"
          placeholder={ translate('KV.TITLE') }
          autoComplete="off"
          maxLength="64"
          required />
      </div>
      <div className="col-xlg-12 form-group form-material">
        <label
          className="control-label"
          htmlFor="kvSendTitle">
          { translate('KV.TITLE') }
        </label>
        <input
          type="text"
          className="form-control"
          name="kvSendTitle"
          onChange={ self.updateInput }
          value={ self.state.kvSendTitle }
          id="kvSendTitle"
          placeholder={ translate('KV.ENTER_A_TITLE') }
          autoComplete="off"
          maxLength="128"
          required />
      </div>
      <div className="col-xlg-12 form-group form-material">
        <label
          className="control-label margin-bottom-10"
          htmlFor="kvSendContent">
          { translate('KV.CONTENT') }
        </label>
        <textarea
          className="full-width height-400"
          rows="20"
          cols="80"
          id="kvSendContent"
          name="kvSendContent"
          onChange={ self.updateInput }
          value={ self.state.kvSendContent }></textarea>
      </div>
      <div className="col-xlg-12 form-group form-material">
        { (4096 - self.state.kvSendContent.length) > 0 &&
          <span>{ translate('KV.CHARS_LEFT') }:  { 4096 - self.state.kvSendContent.length }</span>
        }
        { (4096 - self.state.kvSendContent.length) < 0 &&
          <span>{ translate('KV.KV_ERR_TOO_LONG') }</span>
        }
      </div>
      <div className="col-lg-12">
        <button
          type="button"
          className="btn btn-primary waves-effect waves-light pull-right"
          onClick={ self.props.renderFormOnly ? self.handleSubmit : () => self.changeSendCoinStep(1) }
          disabled={ !self.state.kvSendContent }>
          { translate('INDEX.SEND') } KV { self.props.ActiveCoin.coin }
        </button>
      </div>
    </div>
  )
}

export default kvSendFormRender