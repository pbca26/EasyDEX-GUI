import React from 'react';
import { connect } from 'react-redux';
import translate from '../../../translate/translate';
import {
  apiProposalsList,
  apiProposalCreate,
  apiProposalUpdate,
  apiElectrumDecodeRawTx,
} from '../../../actions/actionCreators';
import Store from '../../../store';
import Config from '../../../config';
import DoubleScrollbar from 'react-double-scrollbar';
import mainWindow, { staticVar } from '../../../util/mainWindow';
import SendCoin from '../sendCoin/sendCoin';
import {
  fromSats,
  toSats,
  sort,
} from 'agama-wallet-lib/src/utils';
import Spinner from '../spinner/spinner';
import { secondsToString } from 'agama-wallet-lib/src/time';

const rawtxTest = "0400008085202f89018ec35424650159a51041e76440430ecbfe3317fc998d1cb4cfaaff5e033390af0000000093004830450221009e24eae27bb027c0b3ba3351b141cb59fce4712608b1c8a6d9773648a4893e5d022052500d000a8b0514893ef0aab77d289432ef7014bc75ec0d616d7db0888b41c9010047522102743d2afdb88ede68fb5938e961b1f41c2b6267b3286516543eb4e4ab87ad0d0a21033397cac4444b3469bff602b98300793c33c32177ae565492e2ea77cc2b3c412c52ae000000000170fa60020000000017a91449237bdf2adacba5c9c2bcd88767cec081365297876f16015d000000000000000000000000000000";

class MultisigProposals extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSection: 'main',
      step: 0,
      proposalIndex: 0,
      proposalDetails: null,
      loading: false,
    };
    this.changeSection = this.changeSection.bind(this);
    this.toggleCreateProposal = this.toggleCreateProposal.bind(this);
    this.sendCoinCB = this.sendCoinCB.bind(this);
    this.openProposalDetails = this.openProposalDetails.bind(this);
    this.toggleMainView = this.toggleMainView.bind(this);
    this.toggleSignTx = this.toggleSignTx.bind(this);
    this.refreshHistory = this.refreshHistory.bind(this);
    //
    this.testProposalCreate = this.testProposalCreate.bind(this);
  }

  refreshHistory() {
    this.setState({
      loading: true,
    });
    setTimeout(() => {
      this.setState({
        loading: false,
      });
    }, 1000);

    Store.dispatch(apiProposalsList(
      this.props.ActiveCoin.coin,
      this.props.Main.multisig.pubKey,
      this.props.Main.multisig.redeemScript,
      'test',
      'test',
    ));
  }

  toggleSignTx() {
    this.setState({
      activeSection: 'create',
      step: 0,
    });

    Store.dispatch(apiProposalsList(
      this.props.ActiveCoin.coin,
      this.props.Main.multisig.pubKey,
      this.props.Main.multisig.redeemScript,
      'test',
      'test',
    ));
  }

  toggleMainView() {
    if (this.state.activeSection === 'create') {
      this.toggleCreateProposal();
    } else if (this.state.activeSection === 'proposal') {
      this.changeSection('main');
    } else {
      this.props.toggleProposalView();
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
      this.props.Main.multisig.pubKey,
      this.props.Main.multisig.redeemScript,
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

    if (this.state.activeSection === 'main') {
      Store.dispatch(apiProposalsList(
        this.props.ActiveCoin.coin,
        this.props.Main.multisig.pubKey,
        this.props.Main.multisig.redeemScript,
        'test',
        'test',
      ));
    }
  }

  changeSection(activeSection) {
    this.setState({
      activeSection,
      proposalDetails: null,
    });
  }

  sendCoinCB(props) {
    console.warn('sendCoinCB multisig', props);

    if (props.hasOwnProperty('spvPreflightRes') &&
        props.spvPreflightRes &&
        props.spvPreflightRes.hasOwnProperty('multisig') &&
        props.currentStep === 2) {
      console.warn('sendCoinCB multisig ready', props.spvPreflightRes.multisig.rawtx);

      if (this.state.activeSection === 'create' &&
          props.spvPreflightRes.multisig.data.signatures.verified === 1) {
        apiProposalCreate(
          this.props.ActiveCoin.coin,
          this.props.Main.multisig.pubKey,
          this.props.Main.multisig.redeemScript,
          'test',
          'test',
          false,
          props.spvPreflightRes.multisig.rawtx
        )
        .then((apiProposalCreateRes) => {
          if (apiProposalCreateRes === true) {
            console.warn('new multisig proposal created');

            this.setState({
              activeSection: 'main',
              step: 0,
              proposalDetails: null,
            });

            Store.dispatch(apiProposalsList(
              this.props.ActiveCoin.coin,
              this.props.Main.multisig.pubKey,
              this.props.Main.multisig.redeemScript,
              'test',
              'test',
            ));
          }
        });
      } else {
        const proposalData = this.props.ActiveCoin.multisigProposals[this.state.proposalIndex];
        let proposalContent = JSON.parse(proposalData.content);
        proposalContent.rawtx = props.spvPreflightRes.multisig.hasOwnProperty('rawTxComplete') && props.spvPreflightRes.multisig.rawTxComplete ? props.spvPreflightRes.multisig.rawTxComplete : props.spvPreflightRes.multisig.rawtx;

        if (props.spvPreflightRes.hasOwnProperty('txid')) {
          proposalContent.txid = props.spvPreflightRes.txid;
        }

        console.warn('apiProposalUpdate new proposalContent', proposalContent);

        if (!proposalContent.rawtx) {
          console.warn('apiProposalUpdate new proposalContent missing rawtx!', 'abort');
        } else {
          apiProposalUpdate(
            this.props.ActiveCoin.coin,
            proposalData.id,
            this.props.Main.multisig.pubKey,
            this.props.Main.multisig.redeemScript,
            'test',
            'test',
            false,
            proposalContent,
            props.spvPreflightRes.multisig.data.signatures.required === props.spvPreflightRes.multisig.data.signatures.verified ? true : false
          )
          .then((apiProposalUpdateRes) => {
            if (apiProposalUpdateRes === true) {
              console.warn('multisig proposal updated');

              if (props.spvPreflightRes.multisig.data.signatures.required !== props.spvPreflightRes.multisig.data.signatures.verified) {
                this.setState({
                  activeSection: 'main',
                  step: 0,
                  proposalDetails: null,
                });
              }

              Store.dispatch(apiProposalsList(
                this.props.ActiveCoin.coin,
                this.props.Main.multisig.pubKey,
                this.props.Main.multisig.redeemScript,
                'test',
                'test',
              ));
            }
          });
        }
      }
    }
  }

  openProposalDetails(proposalIndex) {
    const proposalData = this.props.ActiveCoin.multisigProposals[proposalIndex];
    const proposalContent = JSON.parse(proposalData.content);
    const coin = this.props.ActiveCoin.coin;

    this.setState({
      activeSection: this.state.activeSection === 'proposal' ? 'main' : 'proposal',
      proposalIndex,
    });

    apiElectrumDecodeRawTx(
      coin,
      proposalContent.rawtx
    )
    .then((rawTxDecodeRes) => {      
      console.warn('rawTxDecodeRes', rawTxDecodeRes);

      if (rawTxDecodeRes.msg === 'success') {
        const address = this.props.Dashboard.electrumCoins[coin].pub;
        let toAddress;
        rawTxDecodeRes = rawTxDecodeRes.result;
        
        if (rawTxDecodeRes.multisig.signaturesData === 'wrong redeem script') {
          this.setState({
            multisigCosignWrongRedeemScript: true,
          });
        } else {
          for (let key in rawTxDecodeRes.amounts.outputs) {
            if (key !== address) {
              toAddress = key;
            }
          }

          let multisigCosignError = rawTxDecodeRes.multisig.signaturesData.pubKeys.indexOf(rawTxDecodeRes.multisig.signingPubHex) > -1 ? true : false;
          let multisigCosignTxData = {
            amount: rawTxDecodeRes.amounts.outputs[toAddress ? toAddress : address], 
            change: rawTxDecodeRes.amounts.outputs[address] ? rawTxDecodeRes.amounts.outputs[address] : 0,
            to: !toAddress ? address : toAddress,
            fee: toSats(Number(rawTxDecodeRes.formattedTx.fee)),
            rawtx: rawTxDecodeRes.hex,
          };

          if (coin === 'KMD' &&
              Number(rawTxDecodeRes.formattedTx.fee) > fromSats(staticVar.spvFees[coin.toUpperCase()])) {
            multisigCosignTxData.fee = staticVar.spvFees[coin.toUpperCase()];
            multisigCosignTxData.interest = Number(formattedTx.fee);
          }

          console.warn('multisigCosignTxData', multisigCosignTxData);
          console.warn(multisigCosignTxData.change > 0 ? toSats(multisigCosignTxData.change - fromSats(Number(multisigCosignTxData.fee))) : toSats(multisigCosignTxData.change))
    
          this.setState({
            proposalDetails: {
              id: proposalData.id,
              multisigCosignError,
              multisigCosignTxData,
              sendFrom: address,
              sendTo: multisigCosignTxData.to,
              amount: multisigCosignTxData.amount,
              value: toSats(multisigCosignTxData.amount) - multisigCosignTxData.fee,
              fee: multisigCosignTxData.fee,
              totalInterest: multisigCosignTxData.interest,
              change: multisigCosignTxData.change,
              multisig: rawTxDecodeRes.multisig.signaturesData,
              multisigCosignWrongRedeemScript: false,
              rawTxDecodeRes,
              txid: proposalContent.txid ? proposalContent.txid : null, 
            },
          });
        }
      } else {
        // error
      }
    });
  }

  renderProposalDetails() {
    if (this.state.proposalDetails) {
      const proposal = this.state.proposalDetails;
      
      return (
        <div className="proposal-details">
          {/*debug: { JSON.stringify(proposal) }*/}

          <div>
            <strong>Proposal ID:</strong> { proposal.id }
          </div>
          <div>
            <strong>From:</strong> { proposal.sendFrom }
          </div>
          <div>
            <strong>To:</strong> { proposal.sendTo }
          </div>
          <div>
            <strong>Amount:</strong> { proposal.amount }
          </div>
          <div>
            <strong>Fee:</strong> { fromSats(proposal.fee) } 
          </div>
          { proposal.change &&
            proposal.change !== proposal.amount &&
            <div>
              <strong>Change:</strong> { proposal.change } 
            </div>
          }
          { proposal.totalInterest &&
            <div>
              <strong>KMD rewards:</strong> { proposal.totalInterest } 
            </div>
          }
          <div>
            <strong>Signatures:</strong> { proposal.multisig.signatures.verified } of { proposal.multisig.signatures.required } 
          </div>
          { proposal.txid &&
            <div>
              <strong>Transaction ID:</strong> { proposal.txid }
            </div>
          }
          { proposal.multisig.pubKeys.indexOf(proposal.rawTxDecodeRes.multisig.signingPubHex) === -1 &&
            <button
              className="btn btn-lg btn-block waves-effect btn-primary"
              onClick={ this.toggleSignTx }>
              Sign
            </button>
          }
          { proposal.multisig.pubKeys.indexOf(proposal.rawTxDecodeRes.multisig.signingPubHex) > -1 &&
            proposal.multisig.signatures.required !== proposal.multisig.signatures.verified &&
            <div className="padding-bottom-15">
              <strong>You already signed this transaction</strong>
            </div>
          }
          { proposal.multisig.signatures.required === proposal.multisig.signatures.verified &&
            <div className="padding-bottom-15">
              <strong>
                This transaction is complete
                { proposal.txid && ' and broadcasted' }
              </strong>
            </div>
          }
        </div>
      );
    } else {
      return (
        <div className="proposal-details">
          Decoding proposal details...
        </div>
      );
    }
  }

  renderProposalsList() {
    const _proposals = this.props.ActiveCoin.multisigProposals;
    let _items = [];

    for (let i = 0; i < _proposals.length; i++) {
      if (_proposals[i].coin.toLowerCase() === this.props.ActiveCoin.coin.toLowerCase()) {
        let proposalContent;
        
        try {
          proposalContent = JSON.parse(_proposals[i].content);
        } catch (e) {}

        _items.push(
          <tr
            onClick={ () => this.openProposalDetails(i) }
            key={ `multisig-proposals-list-${i}` }
            className="pointer">
            <td>
              { _proposals[i].id }
            </td>
            <td></td>
            <td></td>
            <td>{ proposalContent && proposalContent.timestamp ? secondsToString(proposalContent.timestamp / 1000) : '' }</td>
            <td>
              { !_proposals[i].archived ? 'Yes' : 'No' }
            </td>
          </tr>
        );
      }
    }

    if (_items.length) {
      return (
        <div className="table-scroll">
          <table className="table table-hover dataTable table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Signatures</th>
                <th>Update history</th>
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
                <th>Created at</th>
                <th>Active</th>
              </tr>
            </tfoot>
          </table>
        </div>
      );
    } else {
      return (
        <div>No proposals found</div>
      );
    }
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
                        onClick={ this.refreshHistory }></i>
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
                        className="btn btn-xs white btn-info waves-effect waves-light hide"
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
                          this.props.ActiveCoin.multisigProposals.error.indexOf('file not found') === -1 &&
                          <div>Error { JSON.stringify(this.props.ActiveCoin.multisigProposals) }</div>
                        }
                        {
                          this.props.ActiveCoin.multisigProposals &&
                          this.props.ActiveCoin.multisigProposals.hasOwnProperty('error') &&
                          this.props.ActiveCoin.multisigProposals.error.indexOf('file not found') > -1 &&
                          <div>No proposals found</div>
                        }
                      </div>
                    </div>
                  }
                  { this.state.activeSection === 'create' &&
                    this.state.step === 0 &&
                    <div className="step1">
                      <SendCoin
                        initState={ this.state.proposalDetails ? {
                          multisigProposal: true,
                          proposalDetails: this.state.proposalDetails,
                        } : { multisigProposal: true }}
                        cb={ this.sendCoinCB }
                        activeSection="send" />
                    </div>
                  }
                  { this.state.activeSection === 'proposal' &&
                    this.renderProposalDetails()
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