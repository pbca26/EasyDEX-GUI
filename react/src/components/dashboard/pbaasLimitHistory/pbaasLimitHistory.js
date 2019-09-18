import React from 'react';
import { connect } from 'react-redux';
import { BOTTOM_BAR_DISPLAY_THRESHOLD } from '../../../util/constants'
import {
  limitAmountRender,
  limitPriceRender,
  limitStatusRender,
  limitTypeRender,
  limitValueRender,
  limitHeightRender,
  PbaasLimitHistoryRender,
  LimitListRender,
} from './pbaasLimitHistory.render'
import DoubleScrollbar from 'react-double-scrollbar';
import translate from '../../../translate/translate';

class PbaasLimitHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      plotData: {},
      itemsListColumns: this.generateItemsListColumns(),
      loading: false,
      defaultPageSize: 20,
      itemsList: [],
      pageSize: 20,
      showPagination: false
    };
  }

  render() {
    return PbaasLimitHistoryRender.call(this);
  }

  defaultSorting(a, b) {
    a = a.props.children;
    b = b.props.children;
    // force null and undefined to the bottom
    a = (a === null || a === undefined) ? -Infinity : a;
    b = (b === null || b === undefined) ? -Infinity : b;
    // force any string values to lowercase
    a = typeof a === 'string' ? a.toLowerCase() : a;
    b = typeof b === 'string' ? b.toLowerCase() : b;
    // Return either 1 or -1 to indicate a sort priority
    if (a > b) {
      return 1;
    }
    if (a < b) {
      return -1;
    }
    // returning 0 or undefined will use any subsequent column sorting methods or the row index as a tiebreaker
    return 0;
  }

  onPageSizeChange(pageSize, pageIndex) {
    this.setState(Object.assign({}, this.state, {
      pageSize: pageSize,
      showPagination: this.state.itemsList && this.state.itemsList.length >= this.state.defaultPageSize,
    }));
  }

  renderLimitList() {  
    let _orders = [1, 2, 3, 4, 5]

    if (_orders.length) {
      return (
        <DoubleScrollbar>
          { LimitListRender.call(this) }
        </DoubleScrollbar>
      );
    } else if (this.state.loading) {
      return (
        <div className="padding-left-15">{ translate('INDEX.LOADING') + "..."}</div>
      );
    } else {
      return (
        <div className="padding-left-15">{ translate('PBAAS.NO_LIMIT_ORDERS') }</div>
      );
    }
  }

  generateItemsListColumns() {
    const _orders = [1, 2, 3, 4, 5]

    let columns = [{
      id: 'limittype',
      Header: translate('PBAAS.TYPE'),
      Footer: translate('PBAAS.TYPE'),
      sortMethod: this.defaultSorting,
      accessor: (order) => limitTypeRender.call(this, order),
    },
    {
      id: 'limitamount',
      Header: translate('PBAAS.AMOUNT_NATIVE'),
      Footer: translate('PBAAS.AMOUNT_NATIVE'),
      sortMethod: this.defaultSorting,
      accessor: (order) => limitAmountRender.call(this, order),
    },
    {
      id: 'limitprice',
      Header: translate('PBAAS.PRICE'),
      Footer: translate('PBAAS.PRICE'),
      sortMethod: this.defaultSorting,
      accessor: (order) => limitPriceRender.call(this, order),
    },
    {
      id: 'limitvalue',
      Header: translate('PBAAS.VALUE'),
      Footer: translate('PBAAS.VALUE'),
      sortMethod: this.defaultSorting,
      accessor: (order) => limitValueRender.call(this, order),
    },
    {
      id: 'limitheight',
      Header: translate('PBAAS.HEIGHT'),
      Footer: translate('PBAAS.HEIGHT'),
      sortMethod: this.defaultSorting,
      accessor: (order) => limitHeightRender.call(this, order),
    },
    {
      id: 'limitstatus',
      Header: translate('PBAAS.STATUS'),
      Footer: translate('PBAAS.STATUS'),
      sortMethod: this.defaultSorting,
      accessor: (order) => limitStatusRender.call(this, order),
    },
    /*{
      id: 'chain-detail',
      Header: translate('PBAAS.CHAIN_INFO'),
      Footer: translate('PBAAS.CHAIN_INFO'),
      className: 'colum--txinfo',
      headerClassName: 'colum--txinfo',
      footerClassName: 'colum--txinfo',
      Cell: props => chainDetailRender.call(this, props.index),
      maxWidth: '100',
      sortable: false,
      filterable: false,
    }*/];

    if (_orders.length <= BOTTOM_BAR_DISPLAY_THRESHOLD) {
      return columns.map((column, index) => {
        delete column.Footer
        return column
      })
    } else {
      return columns
    }

  }
}

const mapStateToProps = (state) => {
  return {
    ActiveCoin: {
      progress: state.ActiveCoin.progress,
    }
  };
};

export default connect(mapStateToProps)(PbaasLimitHistory);