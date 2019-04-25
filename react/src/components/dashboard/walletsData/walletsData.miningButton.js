import React from 'react';
import { connect } from 'react-redux';
import translate from '../../../translate/translate';
import { 
  getMiningInfo,
  setGenerate,
  updateMiningInfo,
} from '../../../actions/actionCreators';
import ReactTooltip from 'react-tooltip';
import Config from '../../../config';
import Store from '../../../store';

class MiningButton extends React.Component {
  constructor() {
    super();
    this.state = {
      numThreadsGUI: 0,
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
    const coin = this.props.ActiveCoin.coin
    getMiningInfo(coin)
    .then(json => {
      Store.dispatch(updateMiningInfo(coin, json))
    });
  }

  updateMining(_cliResponse){
    const coin = this.props.ActiveCoin.coin
    Store.dispatch(updateMiningInfo(coin, _cliResponse))
    this.updateNumThreadsGUI(this.props.Mining.miningInfo[coin].genproclimit);
    console.log(_cliResponse)
  }

  startMining(_numThreads) {
    if (_numThreads === 'stake') {
      _numThreads = 0;
    }
    else if (Number(_numThreads) <= 0) {
      _numThreads = 1;
    }
    
    setGenerate(this.props.ActiveCoin.coin, true, Number(_numThreads))
    .then(result => {
      return getMiningInfo(this.props.ActiveCoin.coin);
    })
    .then(json => {
      this.updateMining(json);
    });
  }

  updateGenerate(_numThreads) {
    if (Number(_numThreads) == 0) {
      this.stopMining();
    }
    else {
      this.startMining(_numThreads);
    }
  }

  stopMining() {
    const coin = this.props.ActiveCoin.coin
    const wasStaking = this.props.Mining.miningInfo[coin].staking;
    setGenerate(this.props.ActiveCoin.coin, false, 0)
    .then(() => {
      if (wasStaking) {
        return this.startMining('stake');
      }
      else {
        return true;
      }
    })
    .then(() => {
      return getMiningInfo(this.props.ActiveCoin.coin);
    })
    .then(json => {
      this.updateMining(json);
    });
  }

  startStaking() {
    this.startMining('stake');
  }

  stopStaking() {
    const threads = this.state.numThreadsGUI;
    setGenerate(this.props.ActiveCoin.coin, false, 0)
    .then(() => {
      if (threads > 0) {
        return setGenerate(this.props.ActiveCoin.coin, true, threads)
      }
      else {
        return true;
      }
    })
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
    const coin = this.props.ActiveCoin.coin
    const miningInfo = this.props.Mining.miningInfo[coin] ? this.props.Mining.miningInfo[coin] : {}

    const isMining = Number(miningInfo.genproclimit) === 0 ? false : miningInfo.generate
    const numThreadsCli = miningInfo.genproclimit
    const localHps = miningInfo.localhashps
    const isStaking = miningInfo.staking
    const mergeMining = Number(miningInfo.mergemining)

    if (
      this.props.ActiveCoin.coin === 'VRSC' || 
      this.props.ActiveCoin.coin === 'VRSCTEST' || 
      Config.reservedChains.indexOf(this.props.ActiveCoin.coin) === -1){
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
                (isMining ? translate('INDEX.TRUE') : translate('INDEX.FALSE'))
            }
          </div>
          <div>
            {
              this.state.loading ? translate('INDEX.LOADING_MINING_INFO') :
              (translate('INDEX.STAKING_STATUS')) + ' ' + 
                (isStaking ? translate('INDEX.TRUE') : translate('INDEX.FALSE'))
            }
          </div>
          <div>
            { this.state.loading ? 
              translate('INDEX.LOADING_MINING_INFO') 
              : 
              ((translate('PBAAS.MERGE_MINING')) + ' ' + 
                (mergeMining > 1 ? 
                translate('PBAAS.MINING_X_CHAINS', mergeMining) 
                : 
                  mergeMining === 1 ? 
                  translate('PBAAS.MERGE_MINING_MAIN_CHAIN')
                  :
                  translate('PBAAS.NOT_MERGE_MINING')))
            }
          </div>
          <div>
            { this.state.loading ? translate('INDEX.LOADING_MINING_INFO') : ((translate('INDEX.MINING_HPS')) + ' ' + (isMining ? Number(localHps / 1000000).toFixed(3) : '0'))}
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
                className="form-control stakemineinput"
                data-tip={ translate('INDEX.THREADS_DESC') }
                value={ this.state.numThreadsGUI }
                onChange={ this.updateInput }/>
                <ReactTooltip
                    effect="solid"
                    className="text-left" />
            <button
                type="button"
                className="btn btn-primary waves-effect waves-light margin-top-5 stakemineinput"
                disabled={this.state.loading}
                onClick={ 
                  !isMining ? (() => this.startMining(this.state.numThreadsGUI)) : 
                    !(numThreadsCli != this.state.numThreadsGUI) ? () => this.stopMining() : 
                      () => this.updateGenerate(this.state.numThreadsGUI) 
                    }>
                      {this.state.loading ? translate('INDEX.LOADING_MINING_INFO') :
                        !isMining ? translate('INDEX.START_MINING') :
                          numThreadsCli != this.state.numThreadsGUI ? translate('INDEX.UPDATE_MINING') :
                            translate('INDEX.STOP_MINING')}
                            </button>            
            <button
                type="button"
                className="btn btn-primary waves-effect waves-light margin-top-5 stakemineinput"
                disabled={this.state.loading}
                onClick={ 
                  !isStaking ? (() => this.startStaking()) : 
                      () => this.stopStaking() 
                    }>
                      {this.state.loading ? translate('INDEX.LOADING_MINING_INFO') :
                        !isStaking ? translate('INDEX.START_STAKING') :
                            translate('INDEX.STOP_STAKING')}
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
    ActiveCoin: state.ActiveCoin,
    Mining: state.Mining
  };
};

export default connect(mapStateToProps)(MiningButton);