import React from 'react';
import { connect } from 'react-redux';
import { 
  PBaaSConvertRender,
} from './pbaasConvert.render';

class PBaaSConvert extends React.Component {
  constructor(props) {
    super(props);
  }

  isSectionActive(section) {
    return this.props.PBaaSConvert.activeSection === section;
  }

  render() {
    if (this.props.ActiveCoin.activeSection === 'convert') return PBaaSConvertRender.call(this);

    return null
  }
}

const mapStateToProps = (state) => {
  return {
    PBaaSConvert: {
      activeSection: state.PBaaSConvert.activeSection
    },
    ActiveCoin: {
      activeSection: state.ActiveCoin.activeSection
    }
  };
};

export default connect(mapStateToProps)(PBaaSConvert);