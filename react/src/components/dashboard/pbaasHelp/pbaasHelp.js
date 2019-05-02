import React from 'react';
import { connect } from 'react-redux';
import { 
  PBaaSHelpRender,
} from './pbaasHelp.render';

class PBaaSHelp extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return PBaaSHelpRender.call(this);
  }
}

export default connect()(PBaaSHelp);