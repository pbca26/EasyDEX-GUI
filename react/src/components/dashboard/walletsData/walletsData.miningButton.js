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
      numThreads: 0,
      cliResponse: null,
      isMining: false,
      localHps: 0,
      loading: true,
      isOnlyStaking: false,
    };
  }

  componentDidMount() {
    this.interval = setInterval(() => this.updateMiningInfo(), 10000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

   // TODO: rerender only if prop is changed
  updateMiningInfo() {
    this.execCliCmd('getmininginfo');
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
          this.updateMiningHPS(_cliResponseParsed.localhashps);
          this.updateMiningState(_cliResponseParsed.generate);
          if (this.state.isMining) {
            if(_cliResponseParsed.genproclimit == -1 || _cliResponseParsed.genproclimit == 0) {
              this.updateNumThreads(0);
              this.updateStakingState(true);
            }
            else {
              this.updateNumThreads(_cliResponseParsed.genproclimit);
              this.updateStakingState(false);
            } 
            
          }
        }
      }

      if (responseType !== 'number' &&
          responseType !== 'array' &&
          responseType !== 'object' &&
          _cliResponseParsed.indexOf('\n') > -1) {
        _cliResponseParsed = _cliResponseParsed.split('\n');
          this.updateMiningHPS(0);
          this.updateMiningState(false);
      }
  }
      
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

  updateMiningState(_isMining){
    this.setState({
      isMining: _isMining,
    });
      this.finishLoading();
  }

  updateMiningHPS(_localHps){
    this.setState({
      localHps: _localHps,
    });
      this.finishLoading();
  }

  startMining(_numThreads) {
    this.startLoading();
    if(_numThreads > 0){
      this.execCliCmd('setgenerate true ' + _numThreads);
    }
    else if (_numThreads == 0){
      this.execCliCmd('setgenerate true');
    }
    this.updateMiningInfo();
  }

  stopMining() {
    this.startLoading();
    this.execCliCmd('setgenerate false');
    this.updateMiningInfo();
  }

  updateInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
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

  updateStakingState(_isOnlyStaking) {
    this.setState({
      isOnlyStaking: _isOnlyStaking,
    });
  }

  updateNumThreads(_numThreads){
    this.setState({
      numThreads: _numThreads,
    });
  }

  render() {
    return (
      <div className="row">
        <div className="col-sm-4">
        <div>
          <div>
            <strong>{ translate('INDEX.MINING_INFO') }</strong>
          </div>
          <div>
            { this.state.loading ? translate('INDEX.LOADING_MINING_INFO') : ((translate('INDEX.MINING_STATUS')) + ' ' + (this.state.isMining ? (this.state.isOnlyStaking ? translate('INDEX.STAKING') : translate('INDEX.MINING')) : translate('INDEX.IDLE'))) }
          </div>
          <div>
            { this.state.loading ? translate('INDEX.LOADING_MINING_INFO') : ((translate('INDEX.MINING_HPS')) + ' ' + (this.state.isMining ? this.state.localHps : '0'))}
          </div>
          <div>
            { translate('INDEX.INPUT_THREADS') }
            <input
              type="text"
              name="numThreads"
              id="threads"
              type="number"
              disabled={ this.state.loading || this.state.isMining }
              min="0"
              className="form-control"
              data-tip={ translate('INDEX.THREADS_DESC') }
              value={ this.state.numThreads }
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
              onClick={ this.state.isMining ? (() => this.stopMining()) : (() => this.startMining(this.state.numThreads)) }>{ this.state.loading ? translate('INDEX.LOADING_MINING_INFO') : (this.state.isMining ? (this.state.isOnlyStaking ? translate('INDEX.STOP_STAKING') : translate('INDEX.STOP_MINING')) : translate('INDEX.START_MINING')) }</button>
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