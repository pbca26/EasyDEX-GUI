import React from 'react';
import { connect } from 'react-redux';
import Store from '../../../store';
import Config from '../../../config';
import mainWindow from '../../../util/mainWindow';
import pbaasNavRender from './pbaasNav.render';
import { pbaasChangeSectionState } from '../../../actions/actionCreators';
const { shell } = window.require('electron');

class PBaaSNav extends React.Component {
  constructor() {
    super();
  }

  isSectionActive(section) {
    return this.props.PBaaSMain.activeSectionPbaas === section;
  }

  changeActiveSection(sectionName) {
    Store.dispatch(pbaasChangeSectionState(sectionName));
  }

  render() {
    return pbaasNavRender.call(this);
  }
}

const mapStateToProps = (state) => {
  return {
    PBaaSMain: {
      activeSectionPbaas: state.PBaaSMain.activeSectionPbaas
    }
  };
};

export default connect(mapStateToProps)(PBaaSNav);