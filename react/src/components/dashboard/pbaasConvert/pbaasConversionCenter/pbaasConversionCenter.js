import React from 'react';
import { connect } from 'react-redux';
import Store from '../../../../store';
import {
  PBaaSConversionCenterRender,
} from './pbaasConversionCenter.render';

class PBaaSConversionCenter extends React.Component {
  constructor(props) {
    super(props);

    if (this.props.PBaaSConvert.formState.currentStep > -1) {
      this.state = this.props.PBaaSConvert.formState
    } else {
      this.state = {
        currentStep: 0,
        selectedFrom: null,
        selectedTo: null
      };
    }
  }

  render() {
    return PBaaSConversionCenterRender.call(this);
  }
}

const mapStateToProps = (state) => {
  return {
    PBaaSConvert: {
      formState: state.PBaaSConvert.quickFormState
    }
  };
};

export default connect(mapStateToProps)(PBaaSConversionCenter);