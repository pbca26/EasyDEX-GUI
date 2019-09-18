import React from 'react';
import { connect } from 'react-redux';
import Store from '../../../../store';
import pbaasConvertNavRender from './pbaasConvertNav.render';
import { pbaasConvertChangeSectionState } from '../../../../actions/actionCreators';

class PBaaSConvertNav extends React.Component {
  constructor() {
    super();
  }

  isSectionActive(section) {
    return this.props.PBaaSConvert.activeSection === section;
  }

  changeActiveSection(sectionName) {
    Store.dispatch(pbaasConvertChangeSectionState(sectionName));
  }

  render() {
    return pbaasConvertNavRender.call(this);
  }
}

const mapStateToProps = (state) => {
  return {
    PBaaSConvert: {
      activeSection: state.PBaaSConvert.activeSection
    }
  };
};

export default connect(mapStateToProps)(PBaaSConvertNav);