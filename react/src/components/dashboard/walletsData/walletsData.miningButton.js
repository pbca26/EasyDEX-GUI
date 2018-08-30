import React from 'react';
import { connect } from 'react-redux';
import translate from '../../../translate/translate';
import { 
  getMiningInfo,
  setGenerate
} from '../../../actions/actionCreators';
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
      numThreadsCli: null,
      loading: false,
      firstTime: true
    };
  }

  componentDidMount() {
    this.updateMiningStatus();
    this.intervalUpdate = setInterval(() => this.updateMiningStatus(), 15000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalUpdate);
  }

  // TODO: rerender only if prop is changed
  updateMiningStatus() {
    getMiningInfo(this.props.ActiveCoin.coin)
    .then(json => {
      this.updateMining(json);
    });
  }

  updateMining(_cliResponse){
    this.setState({
      isMining: _cliResponse.generate,
      numThreadsCli: _cliResponse.genproclimit,
      localHps: _cliResponse.localhashps,
    }, () => {
      this.updateNumThreadsGUI(this.state.numThreadsCli);
    });
  }

  startMining(_numThreads) {
    setGenerate(this.props.ActiveCoin.coin, true, Number(_numThreads))
    .then(result => {
      return getMiningInfo(this.props.ActiveCoin.coin);
    })
    .then(json => {
      this.updateMining(json);
    });
  }

  stopMining() {
    setGenerate(this.props.ActiveCoin.coin, false, 0)
    .then(() => {
      return getMiningInfo(this.props.ActiveCoin.coin);
    })
    .then(json => {
      this.updateMining(json);
    });
  }

  updateInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  updateNumThreadsGUI(_numThreads){
    this.setState({
      numThreadsGUI: _numThreads,
      firstTime: false
    });
  }

  render() {
    if (this.props.ActiveCoin.coin === 'VRSC'){
    return (
      <div className="row">
        <div className="col-sm-5">
        <div>
          <div>
            <strong>{ translate('INDEX.MINING_INFO') }</strong>
          </div>
          <div>
            {
              this.state.loading ? translate('INDEX.LOADING_MINING_INFO') :
              (translate('INDEX.MINING_STATUS')) + ' ' + 
                (!this.state.isMining ? translate('INDEX.IDLE') :
                  (this.state.numThreadsCli === 0 || this.state.numThreadsCli === -1) ? 
                  Number(this.props.ActiveCoin.balance.transparent) === 0 ? translate('INDEX.IDLE') + ' ' + translate('INDEX.SELECT_THREADS'):
                      translate('INDEX.STAKING') 
                      : 
                  Number(this.props.ActiveCoin.balance.transparent) === 0 ? translate('INDEX.MINING') :
                    translate('INDEX.MINING_AND_STAKING'))
            }
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
                onClick={ 
                  !this.state.isMining ? (() => this.startMining(this.state.numThreadsGUI)) : 
                    !(this.state.numThreadsCli != this.state.numThreadsGUI) ? () => this.stopMining() : 
                      () => this.startMining(this.state.numThreadsGUI) 
                    }>
                      {this.state.loading ? translate('INDEX.LOADING_MINING_INFO') :
                        !this.state.isMining ? translate('INDEX.START') :
                          this.state.numThreadsCli != this.state.numThreadsGUI ? translate('INDEX.UPDATE') :
                            translate('INDEX.STOP')}
                            </button>
            </div>
            </div>
        </div>
        </div>
      </div>
    );
  }
  else {
    return (<div></div>);
  }
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