import React from 'react';
import { connect } from 'react-redux';
import Store from '../../../../store';
import {
  PBaaSQuickConvertRender,
  _formProgressRender
} from './pbaasQuickConvert.render';
import {
  _inputFormRender,
  _confirmingFormRender,
  _processingFormRender
} from './pbaasQuickConvert.renderQuickConvertForm';
import { updatePbaasQuickConvertFormState } from '../../../../actions/actionCreators';
import ReactImageFallback from "react-image-fallback";
import { DEFAULT_CHAIN } from '../../../../util/constants'

class PBaaSQuickConvert extends React.Component {
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

    this.formProgressRender = _formProgressRender.bind(this)
    this.inputFormRender = _inputFormRender.bind(this)
    this.confirmingFormRender = _confirmingFormRender.bind(this)
    this.processingFormRender = _processingFormRender.bind(this)
  }

  componentWillUnmount() {
    Store.dispatch(updatePbaasQuickConvertFormState(this.state))
  }

  updateSelectedTo(coinObj) {
    this.setState({
      selectedTo: coinObj,
    });
  }

  updateSelectedFrom(coinObj) {
    this.setState({
      selectedFrom: coinObj,
    });
  }

  incrementStep() {
    this.setState({
      currentStep: this.state.currentStep + 1,
    });
  }

  decrementStep() {
    this.setState({
      currentStep: this.state.currentStep - 1,
    });
  }

  
  renderCoinOption(option) {
    return (
      <div className="convert-dropdown-item-container">
        <ReactImageFallback
          className="img-responsive"
          src={ `assets/images/cryptologo/btc/${option.label.toLowerCase()}.png` }
          alt={ option.label }
          width="30px"
          height="30px"
          fallbackImage={ `assets/images/cryptologo/${DEFAULT_CHAIN}` }/>
        <span className="margin-left-10">{ `${option.label}` }</span>
      </div>
    );
  }

  render() {
    return PBaaSQuickConvertRender.call(this);
  }
}

const mapStateToProps = (state) => {
  return {
    PBaaSConvert: {
      formState: state.PBaaSConvert.quickFormState
    }
  };
};

export default connect(mapStateToProps)(PBaaSQuickConvert);