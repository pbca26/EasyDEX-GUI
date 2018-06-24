import React from 'react';
import translate from '../../../translate/translate';

class About extends React.Component {
  constructor() {
    super();
  }

  openExternalWindow(url) {
    const remote = window.require('electron').remote;
    const BrowserWindow = remote.BrowserWindow;

    const externalWindow = new BrowserWindow({
      width: 1280,
      height: 800,
      title: `${translate('INDEX.LOADING')}...`,
      icon: remote.getCurrentWindow().iguanaIcon,
        webPreferences: {
          nodeIntegration: false,
        },
    });

    externalWindow.loadURL(url);
    externalWindow.webContents.on('did-finish-load', () => {
      setTimeout(() => {
        externalWindow.show();
      }, 40);
    });
  }

  render() {
    return (
      <div className="page margin-left-0">
        <div className="page-content">
          <h2>{ translate('ABOUT.ABOUT_AGAMA') }</h2>
          <p>{ translate('ABOUT.AGAMA_MODES') }</p>
          <ul>
            <li>
              <span className="font-weight-600">{ translate('INDEX.NATIVE_MODE') }</span>:&nbsp;
              { translate('ABOUT.NATIVE_MODE_DESC') }
            </li>
            <li>
              <span className="font-weight-600">{ translate('INDEX.SPV_MODE') }</span>:&nbsp;
              { translate('ADD_COIN.LITE_MODE_DESC') }
            </li>
          </ul>
          <br />

          <span className="font-weight-600">{ translate('ABOUT.AGAMA_NOTE') }</span>

          <br /><br />

          <div className="font-weight-600">{ translate('ABOUT.TESTERS') }</div>
          { translate('ABOUT.TESTERS_P1') } <a className="link" onClick={ () => this.openExternalWindow('https://veruscoin.io') }>{ translate('ABOUT.TESTERS_P2') }</a>.
          { translate('ABOUT.TESTERS_P3') } <a className="link" onClick={ () => this.openExternalWindow('https://discordapp.com/channels/444621794964537354/449633547343495172') }>#community-support</a> Discord { translate('ABOUT.CHANNEL') }.<br />
          { translate('ABOUT.TESTERS_P4') }

          <br /><br />

          { translate('ABOUT.AGAMA_DAPPS') }
          <ul>
            <li>
              <span className="font-weight-600">Jumblr</span>: { translate('ABOUT.JUMBLR_DESC') }
            </li>
            <li>
              <span className="font-weight-600">BarterDEX</span>: { translate('ABOUT.BARTER_DEX_DESC_ALT') }
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default About;
