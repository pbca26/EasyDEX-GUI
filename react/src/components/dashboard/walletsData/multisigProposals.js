import React from 'react';
import { connect } from 'react-redux';
import translate from '../../../translate/translate';
import Config from '../../../config';
import DoubleScrollbar from 'react-double-scrollbar';
import mainWindow, { staticVar } from '../../../util/mainWindow';

const BOTTOM_BAR_DISPLAY_THRESHOLD = 15;

class MultisigProposals extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  renderProposalsList() {

  }

  render() {
    return (
      <div id="edexcoin_dashboardinfo">
        <div className="col-xs-12 margin-top-20 backround-gray">
          <div className="panel nav-tabs-horizontal">
            <div>
              <div className="col-xlg-12 col-lg-12 col-sm-12 col-xs-12">
                <div className="panel">
                  <header className="panel-heading z-index-10">
                    { this.state.loading &&
                      <span className="spinner--small">
                        <Spinner />
                      </span>
                    }
                    { !this.state.loading &&
                      <i
                        className="icon fa-refresh manual-txhistory-refresh pointer"
                        onClick={ this.refreshTxHistory }></i>
                    }
                    <h4 className="panel-title">
                      Multi signature proposals
                      { this.props.ActiveCoin.mode === 'spv' &&
                        Config.userAgreement &&
                        this.props.Main.walletType === 'multisig' &&
                        Config.multisigMediator &&
                        <button
                          type="button"
                          className="btn btn-default btn-switch-kv"
                          onClick={ this.props.toggleProposalView }>
                          Transactions
                        </button>
                      }
                    </h4>
                  </header>
                  <div className="panel-body">
                    <div className="row txhistory-table">
                      { this.renderProposalsList() }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ActiveCoin: state.ActiveCoin,
    Main: state.Main,
    Dashboard: state.Dashboard,
  };
};

export default connect(mapStateToProps)(MultisigProposals);