import React from 'react';
import { connect } from 'react-redux';

import PbaasPriceDataRender from './pbaasPriceData.render';

class PbaasPriceData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      plotData: {}
    };

    this.togglePriceExpansion = this.togglePriceExpansion.bind(this)
  }

  togglePriceExpansion() {
    if (!this.state.expanded) {
      this.setState({
        plotData: this.calculatePlotData()
      }, () => {
        this.setState({
          expanded: true
        })
      })
    } else {
      this.setState({
        expanded: false
      })
    }
  }

  calculatePlotData() {
    //First data points are predetermined
    let dataSet = {
      x: [],
      y: [],
      type: 'scatter',
      name: 'test',
      mode: 'lines+points',
      line: {
          width: 2
      },
    }

    for (let i = 0; i < 60; i++) {
      dataSet.x.push(i)
      dataSet.y.push(Math.random() * 5)
    }

    return dataSet
  }

  render() {
    return PbaasPriceDataRender.call(this);
  }
}

const mapStateToProps = (state) => {
  return {
    ActiveCoin: {
      progress: state.ActiveCoin.progress,
    }
  };
};

export default connect(mapStateToProps)(PbaasPriceData);