import React from 'react';
import translate from '../../../translate/translate';
import ReactTooltip from 'react-tooltip';
import TablePaginationRenderer from '../pagination/pagination';
import Config from '../../../config';
import Spinner from '../spinner/spinner';
import ReactTable from 'react-table';
import mainWindow, { staticVar } from '../../../util/mainWindow';
import { tableSorting } from '../pagination/utils';
import { satsToCoins } from '../../../util/satMath';

const VRSC_LOGO_DIR = `assets/images/cryptologo/btc/vrsc.png`
const EXPONENTIAL = 'exponential'
const LINEAR = 'linear'
const LINEAR_DECAY = 100000000

export const PBaaSDiscoverRender = function() {
  return (
    <span>
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
                    <h4 className="panel-title">{ translate('PBAAS.DEFINED_CHAINS') }</h4>
                  </header>
                  <div className="panel-body">
                    <div className="row padding-bottom-30 padding-top-10">
                      <div className="search-box">
                        {/*<button
                            type="button"
                            className="btn btn-primary waves-effect waves-light col-sm-4"
                            data-tip={ this.state.filterMenuOpen ? translate('FILTER.FILTER_DESC_CONTRACT') : translate('FILTER.FILTER_DESC_EXPAND') }
                            onClick={ this.toggleFilterMenuOpen }>{ translate('FILTER.FILTER_OPTIONS') }</button>*/}
                        <input
                          className="form-control"
                          onChange={ e => this.onSearchTermChange(e.target.value) }
                          placeholder={ translate('DASHBOARD.SEARCH') } />
                      </div>
                      <div className="row">
                        <div className="col-sm-4">
                          <button
                            type="button"
                            className="btn btn-dark waves-effect waves-light margin-top-5"
                            disabled={this.state.loading}
                            onClick={ this.fetchChainsInfo.bind(this) }>
                            <i className="icon fa-refresh"/>
                            { ' ' + translate('INDEX.REFRESH') }
                            </button>
                        </div>
                      </div>
                      { this.state.filterMenuOpen &&
                        "filter menu here"}
                    </div>
                    <div className="row txhistory-table">
                      { this.renderChainsList() }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </span>
  );
}

export const ChainsListRender = function() {
  const _definedChains = this.props.PBaaS.definedChains
  let _data;

  if (_definedChains &&
      !this.state.searchTerm) {
    _data = _definedChains;
  }

  _data = _data || this.state.filteredItemsList;

  return (
    <ReactTable
      data={ _data }
      columns={ this.state.itemsListColumns }
      minRows="0"
      sortable={ true }
      className="-striped -highlight"
      PaginationComponent={ TablePaginationRenderer }
      nextText={ translate('INDEX.NEXT_PAGE') }
      previousText={ translate('INDEX.PREVIOUS_PAGE') }
      showPaginationBottom={ this.state.showPagination }
      pageSize={ this.state.pageSize }
      defaultSortMethod={ tableSorting }
      defaultSorted={[{ // default sort
        id: 'timestamp',
        desc: true,
      }]}
      onPageSizeChange={ (pageSize, pageIndex) => this.onPageSizeChange(pageSize, pageIndex) } />
  );
};

export const chainNameRender = function(chain) {
  const name = chain.name;

  return (<span>{ name }</span>)
};

export const lastNotaryRender = function(chain) {
  const lastnotarizationheight = 0;

  return (<span>{ translate('DASHBOARD.NA') }</span>)
};

export const lastRewardRender = function(chain) {
  const reward = 0;

  return (<span>{ translate('DASHBOARD.NA') }</span>)
};

export const notaryRewardRender = function(chain) {
  const reward = chain.notarizationreward

  return (<span>{ satsToCoins(Number(reward)) }</span>)
}

export const chainDetailRender = function(chainIndex) {
  return (
    <button
      type="button"
      className="btn btn-xs white btn-info waves-effect waves-light btn-kmdtxid"
      onClick={ () => this.toggleChainInfoModal(!this.props.PBaaS.showChainInfo, chainIndex) }>
      <i className="icon fa-search"></i>
    </button>
  );
};

export const premineRender = function(chain) {
  const premine = chain.premine

  return (<span>{ Number(premine) > 0 ? translate('SETTINGS.YES') : translate('SETTINGS.NO') }</span>)
}
