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
    return PBaaSConvertRender.call(this);
  }
}

const mapStateToProps = (state) => {
  return {
    PBaaSConvert: {
      activeSection: state.PBaaSConvert.activeSection
    }
  };
};

export default connect(mapStateToProps)(PBaaSConvert);