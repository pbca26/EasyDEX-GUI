import React from 'react';
import { connect } from 'react-redux';

import PbaasConvertBalanceRender from './pbaasConvertBalance.render';

class PbaasConvertBalance extends React.Component {
  constructor() {
    super();
    /*this.state = {
      currentAddress: null,
      loading: false,
    };*/
    this.isFullySynced = this.isFullySynced.bind(this);
  }

  isFullySynced() {
    const _progress = this.props.ActiveCoin.progress;

    if (_progress &&
        (Number(_progress.balances) +
        Number(_progress.validated) +
        Number(_progress.bundles) +
        Number(_progress.utxo)) / 4 === 100) {
      return true;
    } else {
      return false;
    }
  }

  render() {
    return PbaasConvertBalanceRender.call(this);
  }
}

const mapStateToProps = (state) => {
  return {
    ActiveCoin: {
      progress: state.ActiveCoin.progress,
    }
  };
};

export default connect(mapStateToProps)(PbaasConvertBalance);