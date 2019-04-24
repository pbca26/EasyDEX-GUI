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
    this.state = {
      coin: 'VRSC',
    };
  }

  isSectionActive(section) {
    return this.props.PBaaS.activeSectionPbaas === section;
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
    PBaaS: {
      activeSectionPbaas: state.PBaaS.activeSectionPbaas
    }
  };
};

export default connect(mapStateToProps)(PBaaSNav);