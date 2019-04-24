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
    return this.props.PBaaS.activeSectionPbaas === section;
  }

  render() {
    return pbaasRender.call(this);
  }
}

const mapStateToProps = (state) => {
  return {
    PBaaS: {
      activeSectionPbaas: state.PBaaS.activeSectionPbaas
    }
  };
};

export default connect(mapStateToProps)(PBaaS);