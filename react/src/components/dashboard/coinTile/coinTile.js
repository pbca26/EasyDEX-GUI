import React from 'react';
import { connect } from 'react-redux';
import {
  getCoinTitle,
  getModeInfo,
  isKomodoCoin,
} from '../../../util/coinHelper';
import { arrayMove } from '../../../util/arrayUtil'
import CoinTileItem from './coinTileItem';
import translate from '../../../translate/translate';
import Store from '../../../store';
import CoinTileRender from './coinTile.render';
import { setCoinTileOrder } from '../../../actions/actionCreators'

class CoinTile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toggledSidebar: false,
      tileOrder: props.Dashboard.coinTileOrder,
      draggingKey: null
    };
    this.renderTiles = this.renderTiles.bind(this);
    this.toggleSidebar = this.toggleSidebar.bind(this);
    this.updateDraggedItem = this.updateDraggedItem.bind(this);
    this.dragOver = this.dragOver.bind(this)
  }

  setCoinOrder(coinOrder) {
    this.setState({
      tileOrder: coinOrder
    })
  }

  componentWillUnmount() {
    Store.dispatch(setCoinTileOrder(this.state.tileOrder))
  }

  toggleSidebar() {
    this.setState({
      toggledSidebar: !this.state.toggledSidebar,
    });
  }

  /**
   * Function that is passed as prop to CoinTile to be called everytime a 
   * tile is dragged over another tile
   * @param {String} keyUnder Key of tile not being dragged, under dragged tile
   * @param {String} keyOver Key of tile being dragged
   */
  dragOver(keyUnder, keyOver) {
    let _order = this.state.tileOrder.slice()
    const indexUnder = _order.indexOf(keyUnder)
    const indexOver = _order.indexOf(keyOver)
    
    if (indexUnder === -1 || indexOver === -1) {
      console.error("Error: index not found for coin tile dragged over or under")
      return
    }

    arrayMove(_order, indexOver, indexUnder)
    this.setState({ tileOrder: _order })
  }

  updateDraggedItem(key) {
    this.setState({ draggingKey: key })
  }

  renderTiles() {
    const modes = [
      'native',
      'spv',
      'eth',
    ];
    const allCoins = this.props.allCoins;
    let itemsObj = {}
    let itemsArr = []
    let newOrder = []
    const order = this.state.tileOrder

    if (allCoins) {
      for (let i = 0; i < modes.length; i++) {
        allCoins[modes[i]].sort();
        
        for (let j = 0; j < allCoins[modes[i]].length; j++) {
          const _coinMode = getModeInfo(modes[i]);
          const modecode = _coinMode.code;
          const modetip = _coinMode.tip;
          const modecolor = _coinMode.color;

          const _coinTitle = getCoinTitle(allCoins[modes[i]][j].toUpperCase());
          const coinlogo = allCoins[modes[i]][j].toUpperCase();
          const coinname = translate(((modes[i] === 'spv' || modes[i] === 'native') && isKomodoCoin(allCoins[modes[i]][j]) ? 'ASSETCHAINS.' : 'CRYPTO.') + allCoins[modes[i]][j].toUpperCase());
          const data = {
            coinlogo,
            coinname,
            coin: allCoins[modes[i]][j],
            mode: modes[i],
            modecolor,
            modetip,
            modecode,
            key: `${modes[i]}:${allCoins[modes[i]][j]}`
          };

          itemsObj[`${modes[i]}:${allCoins[modes[i]][j]}`] = <CoinTileItem
                                                              key={ `coin-tile-${modes[i]}-${allCoins[modes[i]][j]}` }
                                                              i={ i }
                                                              item={ data }
                                                              dragOver={ this.dragOver }
                                                              updateDraggedItem={ this.updateDraggedItem }
                                                              draggedItem={ this.state.draggingKey }
                                                              />
        }
      }
    }
    
    order.map((coinKey) => {
      itemsArr.push(itemsObj[coinKey])
      newOrder.push(coinKey)
      delete itemsObj[coinKey]
    })

    itemsArr = itemsArr.concat(Object.values(itemsObj))
    newOrder = newOrder.concat(Object.keys(itemsObj))

    if (JSON.stringify(order) !== JSON.stringify(newOrder)) this.setCoinOrder(newOrder)

    return itemsArr;
  }

  render() {
    return CoinTileRender.call(this);
  }
}

const mapStateToProps = (state) => {
  return {
    allCoins: state.Main.coins,
    Dashboard: {
      coinTileOrder: state.Dashboard.coinTileOrder
    },
  };
};

export default connect(mapStateToProps)(CoinTile);