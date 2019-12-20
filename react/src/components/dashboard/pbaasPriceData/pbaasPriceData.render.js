import React from 'react';
import ReactTooltip from 'react-tooltip';
import translate from '../../../translate/translate';
import Plot from 'react-plotly.js';

const PbaasPriceDataRender = function() {
  return (
    <div
      id="wallet-widgets"
      className="wallet-widgets margin-top-20">
        <div className="widgets-container">
          <div className={ 'col-lg-4 col-xs-12 widget-box' }>
            <div className="widget widget-shadow">
              <div className="clearfix cursor-default">
                <header className="panel-heading z-index-10 expandable-header" onClick={ this.togglePriceExpansion }>
                  <h4 className="panel-title">{ translate('PBAAS.PRICE_DATA', '0.25 VRSC') }</h4>
                  <i className={ 'chevron-expander fa-chevron-' + (this.state.expanded ? 'up' : 'down') }/>
                </header>
                {this.state.expanded &&
                  <div className="panel-body">
                    <div className={ 'price-plot-container' }>
                      <Plot
                        className={ 'price-plot' }
                        data={ [this.state.plotData] }
                        layout={{
                          title: 'Price History',
                          xaxis: {
                            autorange: true
                          },
                        }}
                      />
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default PbaasPriceDataRender;