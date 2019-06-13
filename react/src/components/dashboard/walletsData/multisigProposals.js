import React from 'react';
import { connect } from 'react-redux';
import translate from '../../../translate/translate';
import {
  apiProposalsList,
  apiProposalCreate,
  apiElectrumDecodeRawTx,
} from '../../../actions/actionCreators';
import Store from '../../../store';
import Config from '../../../config';
import DoubleScrollbar from 'react-double-scrollbar';
import mainWindow, { staticVar } from '../../../util/mainWindow';
import {
  fromSats,
  toSats,
} from 'agama-wallet-lib/src/utils';

class MultisigProposals extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSection: 'main',
      step: 0,
      proposalIndex: 0,
      proposalDetails: null,
    };
    this.changeSection = this.changeSection.bind(this);
    this.toggleCreateProposal = this.toggleCreateProposal.bind(this);
    this.toggleMainView = this.toggleMainView.bind(this);
    //
    this.testProposalCreate = this.testProposalCreate.bind(this);
  }

  toggleMainView() {
    if (this.state.activeSection === 'create') {
      this.toggleCreateProposal();
    } else if (this.state.activeSection === 'proposal') {
      this.changeSection('main');
    } else {
      this.props.toggleProposalView
    }
  }

  testProposalCreate() {
    apiProposalCreate(
      this.props.ActiveCoin.coin,
      '123',
      '123',
      'test',
      'test',
      false,
      rawtxTest
    )
  }

  componentWillMount() {
    Store.dispatch(apiProposalsList(
      this.props.ActiveCoin.coin,
      '123',
      '123',
      'test',
      'test',
    ));
  }

  toggleCreateProposal() {
    this.setState({
      activeSection: this.state.activeSection === 'main' ? 'create' : 'main',
      step: 0,
      proposalDetails: null,
    });
  }

  changeSection(activeSection) {
    this.setState({
      activeSection,
      proposalDetails: null,
    });
  }

  renderProposalsList() {
    const _proposals = this.props.ActiveCoin.multisigProposals;
    let _items = [];

    for (let i = 0; i < _proposals.length; i++) {
      _items.push(
        <tr
          onClick={ () => this.openProposalDetails(i) }
          key={ `multisig-proposals-list-${i}` }>
          <td>
            { _proposals[i].id }
          </td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td>
            { !_proposals[i].archived ? 'Yes' : 'No' }
          </td>
        </tr>
      );
    }

    return (
      <div className="table-scroll">
        <table className="table table-hover dataTable table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Signatures</th>
              <th>Update history</th>
              <th>Comments</th>
              <th>Created at</th>
              <th>Active</th>
            </tr>
          </thead>
          <tbody>
          { _items }
          </tbody>
          <tfoot>
            <tr>
              <th>ID</th>
              <th>Signatures</th>
              <th>Update history</th>
              <th>Comments</th>
              <th>Created at</th>
              <th>Active</th>
            </tr>
          </tfoot>
        </table>
      </div>
    );
  }

  render() {
    return (
      <div id="edexcoin_dashboardinfo">
        <div className="col-xs-12 margin-top-20 backround-gray multisig-proposals">
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
                          onClick={ this.toggleMainView }>
                          { this.state.activeSection === 'main' ? 'Transactions' : 'Back to proposals list' }
                        </button>
                      }
                    </h4>
                  </header>
                  { this.state.activeSection === 'main' &&
                    <div className="panel-body margin-top-20">
                      <button
                        type="button"
                        className="btn btn-xs white btn-info waves-effect waves-light btn-proposal-new"
                        onClick={ this.toggleCreateProposal }>
                        + New proposal
                      </button>
                      <button
                        type="button"
                        className="btn btn-xs white btn-info waves-effect waves-light"
                        onClick={ this.testProposalCreate }>
                        Proposal create test
                      </button>
                      <div className="row txhistory-table">
                        {
                          this.props.ActiveCoin.multisigProposals &&
                          !this.props.ActiveCoin.multisigProposals.hasOwnProperty('error') &&
                          this.renderProposalsList()
                        }
                        {
                          this.props.ActiveCoin.multisigProposals &&
                          this.props.ActiveCoin.multisigProposals.hasOwnProperty('error') &&
                          <div>Error { JSON.stringify(this.props.ActiveCoin.multisigProposals) }</div>
                        }
                      </div>
                    </div>
                  }
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