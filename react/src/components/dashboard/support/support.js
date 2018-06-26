import React from 'react';
import translate from '../../../translate/translate';

const shell = window.require('electron').shell;

class Support extends React.Component {
  constructor() {
    super();
  }

  openExternalWindow(url) {
    return shell.openExternal(url);
  }

  render() {
    return (
      <div className="page margin-left-0">
        <div className="page-content">
          <h2>{ translate('SETTINGS.SUPPORT') }</h2>
          <div className="row">
            <div className="support-box-wrapper">
              <div
                className="support-box"
                onClick={ () => this.openExternalWindow('https://discordapp.com/channels/444621794964537354/449633547343495172') }>
                <img
                  src="assets/images/cryptologo/vrsc.png"
                  alt={ translate('SETTINGS.SUPPORT_TICKETS') } />
                <div className="support-box-title">{ translate('SETTINGS.SUPPORT_TICKETS') }</div>
                <div className="support-box-link">https://discordapp.com/channels/444621794964537354/449633547343495172</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Support;
