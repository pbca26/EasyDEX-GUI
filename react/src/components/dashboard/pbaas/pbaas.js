import React from 'react';
import { connect } from 'react-redux';
import Store from '../../../store';
import Config from '../../../config';
import mainWindow from '../../../util/mainWindow';
import pbaasRender from './pbaas.render';
const { shell } = window.require('electron');

class PBaaS extends React.Component {
  constructor() {
    super();
    this.state = {
      coin: 'VRSC',
    };
  }

  isSectionActive(section) {
    return false //this.props.PBaaSMain.activeSectionPbaas === section;
  }

  render() {
    return pbaasRender.call(this);
  }
}

const mapStateToProps = (state) => {
  return {
    PBaaSMain: {
      activeSectionPbaas: state.PBaaSMain.activeSectionPbaas
    }
  };
};

export default connect(mapStateToProps)(PBaaS);
