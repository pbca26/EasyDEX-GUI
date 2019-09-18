import React from 'react';
import ReactTooltip from 'react-tooltip';
import translate from '../../../translate/translate';
import { BUY, SELL } from '../../../util/constants'
import ReactTable from 'react-table';
import { tableSorting } from '../pagination/utils';
import TablePaginationRenderer from '../pagination/pagination';

export const PbaasLimitHistoryRender = function() {
  return (
    <div
      id="wallet-widgets"
      className="wallet-widgets margin-top-20">
        <div className="widgets-container">
          <div className={ 'col-lg-4 col-xs-12 widget-box' }>
            <div className="widget widget-shadow">
              <div className="clearfix cursor-default">
                <header className="panel-heading z-index-10">
                  <h4 className="panel-title">{ translate('PBAAS.LIMIT_CONVERT_HISTORY') }</h4>
                </header>
                <div className="limit-history-control-space">
                  <div className="search-box">
                    {/*<button
                        type="button"
                        className="btn btn-primary waves-effect waves-light col-sm-4"
                        data-tip={ this.state.filterMenuOpen ? translate('FILTER.FILTER_DESC_CONTRACT') : translate('FILTER.FILTER_DESC_EXPAND') }
                        onClick={ this.toggleFilterMenuOpen }>{ translate('FILTER.FILTER_OPTIONS') }</button>*/}
                    {/*<input
                      className="form-control"
                      onChange={ e => this.onSearchTermChange(e.target.value) }
                      placeholder={ translate('DASHBOARD.SEARCH') } />*/}
                  </div>
                  <div className="row">
                    <div className="col-sm-4">
                      <button
                        type="button"
                        className="btn btn-dark waves-effect waves-light margin-top-5"
                        disabled={this.state.loading}
                        /*onClick={ this.fetchChainsInfo.bind(this) } */>
                        <i className="icon fa-refresh"/>
                        { ' ' + translate('INDEX.REFRESH') }
                        </button>
                    </div>
                  </div>
                  {/* this.state.filterMenuOpen &&
                    "filter menu here"*/}
                </div>
                <div className="limit-history-table">
                  { this.renderLimitList() }
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export const LimitListRender = function() {
  //const _definedChains = this.props.PBaaSMain.definedChains
  let _data = [{
    type: 'buy',
    amount: 254,
    price: 0.46,
    status: 'waiting',
    blockheight: 239849
  }, {
    type: 'sell',
    amount: 100,
    price: 0.78,
    status: 'success',
    blockheight: 322444
  }, {
    type: 'buy',
    amount: 50,
    price: 0.2,
    status: 'success',
    blockheight: 123456
  }, {
    type: 'buy',
    amount: 800,
    price: 0.65,
    status: 'success',
    blockheight: 452456
  }, {
    type: 'buy',
    amount: 400,
    price: 0.87,
    status: 'failed',
    blockheight: 423453
  }];

  /*if (_definedChains &&
      !this.state.searchTerm) {
    _data = _definedChains;
  }*/

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
        id: 'limitheight',
        desc: true,
      }]}
      onPageSizeChange={ (pageSize, pageIndex) => this.onPageSizeChange(pageSize, pageIndex) } />
  );
};

export const limitTypeRender = function(order) {
  const type = order.type;

  return (
    <span className={`label label-${type === BUY ? 'success' : 'danger' }`}>
      <span>{ type === BUY ? translate('PBAAS.BUY') : translate('PBAAS.SELL') }</span>
    </span>
  )
};

export const limitAmountRender = function(order) {
  const amount = order.amount;

  return (<span>{ amount }</span>)
};

export const limitPriceRender = function(order) {
  const price = order.price;

  return (<span>{ price }</span>)
};

export const limitValueRender = function(order) {
  const value = order.amount * order.price;

  return (<span>{ value }</span>)
};

export const limitHeightRender = function(order) {
  const height = order.blockheight;

  return (<span>{ height }</span>)
};

export const limitStatusRender = function(order) {
  const status = order.status;

  return (<span>{ status }</span>)
};

/* TODO: Finish this in future PBaaS version

export const cancelLimitRender = function(orderIndex) {
  return (
    <button
      type="button"
      className="btn btn-xs white btn-info waves-effect waves-light btn-kmdtxid"
      onClick={ () => this.toggleChainInfoModal(!this.props.PBaaSMain.showChainInfo, chainIndex) }>
      <i className="icon fa-search"></i>
    </button>
  );
};*/