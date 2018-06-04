import React from 'react';
import { connect } from 'react-redux';
import translate from '../../../translate/translate';
import { shepherdCli } from '../../../actions/actionCreators';
import Store from '../../../store';
import ReactTooltip from 'react-tooltip';

class MiningButton extends React.Component {
  constructor() {
    super();
    this.state = {
      numThreadsGUI: 0,
      cliResponse: null,
      isMining: false,
      localHps: 0,
      loading: true,
      numThreadsCli: null,
    };
  }

  componentDidMount() {
    this.loopUpdateMiningInfoCli();
    this.intervalUpdate = setInterval(() => this.loopUpdateMiningInfoCli(), 15000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalUpdate);
    clearInterval(this.intervalDelay);
  }

   // TODO: rerender only if prop is changed
  updateMiningStatus() {
    const _cliResponse = this.props.Settings.cli;
    let _items = [];

    if (_cliResponse) {
      let _cliResponseParsed;
      let responseType;

      try {
        _cliResponseParsed = JSON.parse(_cliResponse.result);
      } catch(e) {
        _cliResponseParsed = _cliResponse.result;
      }

      if (Object.prototype.toString.call(_cliResponseParsed) === '[object]' ||
          typeof _cliResponseParsed === 'object') {
        responseType = 'object';
        if((_cliResponseParsed.generate !== null) && (_cliResponseParsed.localhashps !== null)){
          this.updateMining(_cliResponseParsed);
          /*
          if (this.state.isMining) {
              this.updateNumThreadsGUI(_cliResponseParsed.genproclimit);
          }
          */
        }
      }

      if (responseType !== 'number' &&
          responseType !== 'array' &&
          responseType !== 'object' &&
          _cliResponseParsed.indexOf('\n') > -1) {
        _cliResponseParsed = _cliResponseParsed.split('\n');
        this.startLoading();
      }
  }
      
}

  loopUpdateMiningInfoCli(){
    let i = 100;
    this.updateMiningInfoCli(i);
    this.intervalDelay = setInterval(() => this.tickInfoDelay(i, this.intervalDelay), 1000);
  }

  tickInfoDelay(_i, interval){
    if (this.state.loading && _i !== 500) 
      {
        _i += 50;
        this.updateMiningInfoCli(_i);
        return;
      }
    clearInterval(interval);
    _i = 100;
  }

  updateMiningInfoCli(_timeout){
    setTimeout(() => this.getMiningInfo(), _timeout);
    setTimeout(() => this.updateMiningStatus(), (_timeout*2));
  }

  execCliCmd(_command) {
    Store.dispatch(
      shepherdCli(
        'passthru',
        this.props.ActiveCoin.coin,
        _command
      )
    );
  }

  updateMining(_cliResponse){
    this.setState({
      isMining: _cliResponse.generate,
    });
    this.setState({
      localHps: _cliResponse.localhashps,
    });
    this.setState({
      numThreadsCli: _cliResponse.genproclimit,
    });
    this.finishLoading();
  }

  startMining(_numThreads) {
    this.startLoading();
    this.execCliCmd('setgenerate true ' + _numThreads);
    this.loopUpdateMiningInfoCli();
  }


  stopMining() {
    this.startLoading();
    this.execCliCmd('setgenerate false');
    this.loopUpdateMiningInfoCli();
  }

  updateInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
    if (this.state.isMining) {
      this.startMining(e.target.value);
    }
  }

  updateCliResponse(_response) {
      this.setState({
        cliResponse: _response,
      });
  }

  finishLoading() {
    if(this.state.loading){
      this.setState({
        loading: false,
      });
    }
  }

  startLoading() {
    if(!this.state.loading){
      this.setState({
        loading: true,
      });
    }
  }

  updateNumThreadsGUI(_numThreads){
    this.setState({
      numThreadsGUI: _numThreads,
    });
  }

  getMiningInfo(){
    this.execCliCmd('getmininginfo');
  }

  dynamicallyUpdateMining(){
    if (this.state.numThreadsGUI !== this.state.numThreadsCli) {
      this.startMining(this.state.numThreadsGUI);
      this.updateInput();
    }
  }

  render() {
    return (
      <div className="row">
        <div className="col-sm-5">
        <div>
          <div>
            <strong>{ translate('INDEX.MINING_INFO') }</strong>
          </div>
          <div>
            { this.state.loading ? translate('INDEX.LOADING_MINING_INFO') : 
            ((translate('INDEX.MINING_STATUS')) + ' ' + (this.state.isMining ? ((this.state.numThreadsCli === 0 || this.state.numThreadsCli === -1) ? translate('INDEX.STAKING') :
            (translate('INDEX.MINING') + ' ' + translate('INDEX.WITH') + ' ' + this.state.numThreadsCli + ' ' + (this.state.numThreadsCli === 1 ? translate('INDEX.THREAD') : translate('INDEX.THREADS')))) : 
            translate('INDEX.IDLE'))) }
          </div>
          <div>
            { this.state.loading ? translate('INDEX.LOADING_MINING_INFO') : ((translate('INDEX.MINING_HPS')) + ' ' + (this.state.isMining ? Number(this.state.localHps / 1000000).toFixed(3) : '0'))}
          </div>
      </div>
      <div className="row">
        <div className="col-sm-4">
            <div>
              { translate('INDEX.INPUT_THREADS') }
              <input
                type="text"
                name="numThreadsGUI"
                id="threads"
                type="number"
                disabled={ this.state.loading }
                min="0"
                className="form-control"
                data-tip={ translate('INDEX.THREADS_DESC') }
                value={ this.state.numThreadsGUI }
                onChange={ this.updateInput }/>
                <ReactTooltip
                    effect="solid"
                    className="text-left" />
            </div>
            <div>
            <button
                type="button"
                className="btn btn-primary waves-effect waves-light margin-top-5"
                disabled={this.state.loading}
                onClick={ this.state.isMining ? (() => this.stopMining()) : (() => this.startMining(this.state.numThreadsGUI)) }>{ this.state.loading ? translate('INDEX.LOADING_MINING_INFO') : (this.state.isMining ? ((this.state.numThreadsCli === 0 || this.state.numThreadsCli === -1) ? translate('INDEX.STOP_STAKING') : translate('INDEX.STOP_MINING')) : translate('INDEX.START_MINING')) }</button>
            </div>
            </div>
        </div>
          
          
          <div className="col-sm-12 col-xs-12 text-align-left">
            <div className="padding-top-40 padding-bottom-20 horizontal-padding-0">

            </div>
          </div>
        </div>
      </div>
    );
  };
}

const mapStateToProps = (state) => {
  return {
    Main: {
      coins: state.Main.coins,
    },
    Settings: state.Settings,
    ActiveCoin: state.ActiveCoin
  };
};

export default connect(mapStateToProps)(MiningButton);