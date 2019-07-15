import React from 'react';
import { connect } from 'react-redux';
import { 
  PBaaSConvertRender,
} from './pbaasConvert.render';

class PBaaSConvert extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return PBaaSConvertRender.call(this);
  }
}

export default connect()(PBaaSConvert);