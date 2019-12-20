import React from 'react';
import { connect } from 'react-redux';
import Store from '../../../store';
import Config from '../../../config';
import mainWindow from '../../../util/mainWindow';
import {
  PBaaSCreateRender,
  _formProgressRender
} from './pbaasCreate.render';
import {
  _nameFormRender,
  _launchFormRender,
  _rewardFormRender,
  _renderEraCapsules,
  _billingFormRender,
  _nodesFormRender,
  _renderNodeCapsules,
  _confirmFormRender,
  _confirmErasRender,
  _confirmNodesRender
} from './pbaasCreate.renderCreateForm';
import translate from '../../../translate/translate';
import { addressVersionCheck } from 'agama-wallet-lib/src/keys';
import { toSats } from 'agama-wallet-lib/src/utils';
import networks from 'agama-wallet-lib/src/bitcoinjs-networks';
import { updatePbaasFormState, defineAndCreateChain, triggerToaster } from '../../../actions/actionCreators';
import { 
  EXPONENTIAL,
  LINEAR,
  END,
  FREQUENCY,
  MAGNITUDE,
  LINEAR_DECAY,
  MIN_BILLING_PERIOD
} from '../../../util/constants';
const { shell } = window.require('electron');

class PBaaSCreate extends React.Component {
  constructor(props) {
    super(props);

    if (this.props.PBaaSMain.formState.currentStep > -1) {
      this.state = this.props.PBaaSMain.formState
    } else {
      this.state = {
        currentStep: 0,
        chainName: '',
        includePremine: false,
        paymentAddr: '',
        premineAmount: '',
        isReserveCurrency: false,
        publicPreconvert: false,
        initialContribution: '',
        conversionRate: '',
        minPreconvert: '',
        maxPreconvert: '',
        launchfee: '',
        startBlock: '',
        rewardEras: [],
        nodes: [],
        visualizeEras: false,
        plotData: [],
        initCost: '',
        billingPeriod: '',
        errors: {
          //Errors for eras are handled inside era 
          //objects in rewardEras, and errors for 
          //nodes are handled inside node objects,
          //inside nodes
          chainName: false,
          paymentAddr: false,
          premineAmount: false,
          initialContribution: '',
          conversionRate: '',
          minPreconvert: '',
          maxPreconvert: '',
          launchfee: false,
          startBlock: false,
          initCost: false,
          billingPeriod: false
        }
      };
    }

    this.formProgressRender = _formProgressRender.bind(this)
    this.nameFormRender = _nameFormRender.bind(this)
    this.launchFormRender = _launchFormRender.bind(this)
    this.rewardFormRender = _rewardFormRender.bind(this)
    this.renderEraCapsules = _renderEraCapsules.bind(this)
    this.billingFormRender = _billingFormRender.bind(this)
    this.nodesFormRender = _nodesFormRender.bind(this)
    this.renderNodeCapsules = _renderNodeCapsules.bind(this)
    this.confirmErasRender = _confirmErasRender.bind(this)
    this.confirmFormRender = _confirmFormRender.bind(this)
    this.confirmNodesRender = _confirmNodesRender.bind(this)
    this.updateInput = this.updateInput.bind(this)
    this.updateChainName = this.updateChainName.bind(this)
    this.updateAddressInput = this.updateAddressInput.bind(this)
    this.updateAmountInput = this.updateAmountInput.bind(this)
    this.updatePercentInput = this.updatePercentInput.bind(this)
    this.updateStartBlockInput = this.updateStartBlockInput.bind(this)
    this.updateBillingPeriod = this.updateBillingPeriod.bind(this)
    this.updateDecayType = this.updateDecayType.bind(this)
    this.updateEraCapsuleData = this.updateEraCapsuleData.bind(this)
    this.updateNodeCapsuleData = this.updateNodeCapsuleData.bind(this)
  }

  componentWillUnmount() {
    Store.dispatch(updatePbaasFormState(this.state))
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

  setCurrentStep(step) {
    this.setState({
      currentStep: step,
    });
  }

  togglePremine() {
    this.setState({
      includePremine: !this.state.includePremine,
    });
  }

  addEra() {
    let _rewardEras = this.state.rewardEras.slice()

    _rewardEras.push({
      hidden: false,
      initReward: '',
      decay: {
        type: 'exponential',
        magnitude: '',
        halving: '',
      },
      end: '',
      errors: {
        end: false,
        halving: false,
        magnitude: false,
        initReward: false,
        maxInt: false
      }
    })

    this.setState({
      rewardEras: _rewardEras,
    });
  }

  removeEra(index) {
    let _rewardEras = this.state.rewardEras

    _rewardEras.splice(index, 1)

    this.setState({
      rewardEras: _rewardEras,
    });
  }

  addNode() {
    let _nodes = this.state.nodes.slice()

    _nodes.push({
      nodeAddress: '',
      paymentAddress: '',
      errors: {
        nodeAddress: false,
        paymentaddress: false,
      }
    })

    this.setState({
      nodes: _nodes,
    });
  }

  removeNode(index) {
    let _nodes = this.state.nodes

    _nodes.splice(index, 1)

    this.setState({
      nodes: _nodes,
    });
  }

  updateInput(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  updateChainName(e) {
    let value = e.target.value
    value = (value.replace(/\s/g,'')).toUpperCase();

    this.setState({
      [e.target.name]: value,
    });
  }

  updateStartBlockInput(e) {
    let value = e.target.value
    let name = e.target.name
    let _errors = this.state.errors

    if (isNaN(value) || !Number.isInteger(Number(value)) || Number(value) < 0) {
      _errors[name] = true
    } else if (_errors[name]) {
      _errors[name] = false
    }

    this.setState({
      errors: _errors,
      [name]: value,
    });
  }

  updateBillingPeriod(e) {
    let value = e.target.value
    let name = e.target.name
    let _errors = this.state.errors

    if (isNaN(value) || !Number.isInteger(Number(value)) || Number(value) < MIN_BILLING_PERIOD) {
      _errors[name] = true
    } else if (_errors[name]) {
      _errors[name] = false
    }

    this.setState({
      errors: _errors,
      [name]: value,
    });
  }

  updateAddressInput(e) {
    let value = e.target.value
    let name = e.target.name
    let _errors = this.state.errors
    let _validateAddress = addressVersionCheck(networks['vrsc'], value)

    if (_validateAddress === 'Invalid pub address' && value.length > 0) {
      _errors[name] = true
    } else if (_errors[name]) {
      _errors[name] = false
    }

    this.setState({
      errors: _errors,
      [name]: value,
    });
  }

  updateAmountInput(e) {
    let value = e.target.value
    let name = e.target.name
    let _errors = this.state.errors

    if (isNaN(value) || Number(value) < 0) {
      _errors[name] = true
    } else if (_errors[name]) {
      _errors[name] = false
    }

    this.setState({
      errors: _errors,
      [name]: value,
    });
  }

  updatePercentInput(e) {
    let value = e.target.value
    let name = e.target.name
    let _errors = this.state.errors

    if (isNaN(value) || Number(value) < 0 || Number(value) > 100) {
      _errors[name] = true
    } else if (_errors[name]) {
      _errors[name] = false
    }

    this.setState({
      errors: _errors,
      [name]: value,
    });
  }

  //This will not work for objects with depth past two 
  //objects
  updateEraCapsuleData(e) {
    //name format is parentObject.child-indexOfEraCapsule
    //or if no object, key-indexOfEraCapsule

    let name = e.target.name
    let _rewardEras = this.state.rewardEras.slice()
    let value = e.target.value
    let valueName
    let index

    if (name.indexOf('.') > -1) {
      let splitOne = name.split('.')
      let splitTwo = splitOne[1].split('-')
      valueName = splitTwo[0]
      index = Number(splitTwo[1])
      
      _rewardEras[index][splitOne[0]][valueName] = value
    } else {
      let split = name.split('-')
      valueName = split[0]
      index = Number(split[1])

      _rewardEras[index][valueName] = value
    }

    if (
      valueName === 'end' && 
      (Number(value) < (index !== 0 ? _rewardEras[index-1].end : 1) || !Number.isInteger(Number(value)))) {
      _rewardEras[index].errors[valueName] = true
    } else if (valueName === 'halving' && (!Number.isInteger(Number(value)) || Number(value) < 0)) {
      _rewardEras[index].errors[valueName] = true
    } else if (Number(value) < 0) {
      _rewardEras[index].errors[valueName] = true
    } else if (valueName === 'halving' && _rewardEras[index].errors[FREQUENCY]) {
      _rewardEras[index].errors[valueName] = false
    } else if (_rewardEras[index].errors[valueName]) {
      _rewardEras[index].errors[valueName] = false
    }

    
    this.setState({
      rewardEras: _rewardEras,
    });
  }

  updateNodeCapsuleData(e) {
    //name format is key-indexOfNodeCapsule

    let name = e.target.name
    let _nodes = this.state.nodes.slice()
    let value = e.target.value
    let valueName
    let index
    let split = name.split('-')

    valueName = split[0]
    index = Number(split[1])

    _nodes[index][valueName] = value

    if (valueName === 'paymentAddress' && addressVersionCheck(networks['vrsc'], value) === 'Invalid pub address' && value.length > 0) {
      _nodes[index].errors[valueName] = true
    } else if (valueName === 'nodeAddress' && value.length > 0 && !(/^\S+:{1}\S+$/.test(value))) {
      _nodes[index].errors[valueName] = true
    } else if (_nodes[index].errors[valueName]) {
      _nodes[index].errors[valueName] = false
    }

    this.setState({
      nodes: _nodes,
    });
  }

  updateDecayType(e, i) {
    let _rewardEras = this.state.rewardEras.slice()
    let value = e.value

    _rewardEras[i].decay.type = value

    this.setState({
      rewardEras: _rewardEras,
    });
  }

  toggleIsReserveCurrency() {
    this.setState({
      isReserveCurrency: !this.state.isReserveCurrency,
      publicPreconvert: this.state.isReserveCurrency ? false : this.state.publicPreconvert
    });
  }

  togglePublicPreconvert() {
    this.setState({
      publicPreconvert: !this.state.publicPreconvert,
    });
  }

  rewardFormComplete() {
    for (let i = 0; i < this.state.rewardEras.length; i++) {
      let rewardEra = this.state.rewardEras[i]

      if (rewardEra.initReward.length < 1) {
        return false
      }

      if (rewardEra.decay.type === EXPONENTIAL && (rewardEra.decay.halving.length < 1 || rewardEra.decay.magnitude.length < 1)) {
        return false
      } 
      
      if ((i < this.state.rewardEras.length - 1) && rewardEra.end.length < 1) {
        return false
      }

      for (let key in rewardEra.errors) {
        if (rewardEra.decay.type === LINEAR && 
            key !== FREQUENCY &&
            key !== MAGNITUDE &&
            rewardEra.errors[key]) {
          return false
        } else if (rewardEra.decay.type === EXPONENTIAL && rewardEra.errors[key]) {
          return false
        }
      }
    }

    return true
  }

  parseEraData(era, index, lastEra, nextEra) {
    let plotType = era.decay.type
    let initBlock = lastEra ? Number(lastEra.end) : 0
    let eraEnd = nextEra ? Number(era.end) : 0
    let nextReward = nextEra ? Number(nextEra.initReward) : 0
    let initReward = Number(era.initReward)

    //First data points are predetermined
    let dataSet = {
      x: [initBlock],
      y: [initReward],
      type: 'scatter',
      name: translate('PBAAS.ERA') + ' ' + (index + 1),
      mode: 'lines+markers',
      line: plotType === EXPONENTIAL ? 
        {shape: 'hv'} 
      : 
        {
          width: 2
        },
    }

    if (plotType === LINEAR && nextEra) {
      //We only need two data points for linear
      dataSet.x.push(eraEnd)
      dataSet.y.push(nextReward)
    } else if (plotType === EXPONENTIAL) {
      let halving = Number(era.decay.halving)
      let nextDivide = initBlock + halving
      let decay = era.decay.magnitude
      let end = eraEnd
      
      //Give the infinite end of the graph an arbitrary length
      if (!end) {
        end = initBlock + (halving*15.5)
      } 

      //Calculating individual data points
      while (nextDivide < end) {
        dataSet.x.push(nextDivide)
        dataSet.y.push(initReward * Math.pow((1/decay), (nextDivide - initBlock)/halving))

        nextDivide += halving
      }

      //Put in the final block to either connect eras or show a continuation on the last era
      if (nextReward) {
        dataSet.x.push(end)
        dataSet.y.push(nextReward)
      } else {
        dataSet.x.push(nextDivide - (halving*0.999))
        dataSet.y.push(initReward * Math.pow((1/decay), ((nextDivide - halving) - initBlock)/halving))
      }
      
    }

    return dataSet
  }

  calculatePlotData() {
    const _rewardEras = this.state.rewardEras
    let _plotData = _rewardEras.map((rewardEra, index) => {
      return (
        this.parseEraData(
          rewardEra, 
          index, 
          index === 0 ? null : _rewardEras[index - 1],
          index === _rewardEras.length - 1 ? null : _rewardEras[index + 1]
        )
      )
    })

    this.setState({
      plotData: _plotData,
    });
  }

  parseState() {
    let payload = {
      name: this.state.chainName,
      paymentaddress: this.state.paymentAddr,
      premine: 0,
      initialcontribution: 0,
      conversion: 0,
      minpreconvert: 0,
      maxpreconvert: 0,
      launchfee: 0,
      startblock: Number(this.state.startBlock),
      eras: [],
      notarizationreward: 0,
      billingperiod: 0,
      nodes: [],
    }

    if (this.state.includePremine) {
      payload.premine = toSats(Number(this.state.premineAmount))
    }

    payload.eras = this.state.rewardEras.map((rewardEra, index) => {
      let returnObj = {
        reward: toSats(Number(rewardEra.initReward)),

        decay: rewardEra.decay.type === LINEAR ? 
          LINEAR_DECAY 
        : 
            (Number(rewardEra.decay.magnitude) === 2 ? 0 
          : 
            Number((LINEAR_DECAY/Number(rewardEra.decay.magnitude)).toFixed(0))),

        halving: rewardEra.decay.type === LINEAR ? 1 : Number(rewardEra.decay.halving),
        eraend: index === this.state.rewardEras - 1 ? 0 : Number(Number(rewardEra.end))
      }
      
      return returnObj
    })

    if (this.state.isReserveCurrency) {
      payload.initialcontribution = toSats(Number(this.state.initialContribution))
      payload.conversion = toSats(Number(this.state.conversionRate))
      if (payload.eras && Array.isArray(payload.eras) && payload.eras.length > 0) {
        payload.eras[0].eraoptions = 1
      }
      
      if (this.state.publicPreconvert) {
        payload.minpreconvert = toSats(Number(this.state.minPreconvert))
        payload.maxpreconvert = toSats(Number(this.state.maxPreconvert))
        payload.launchfee = toSats(Number(this.state.launchfee) / 100)
      }
    }

    payload.notarizationreward = toSats(Number(this.state.initCost))
    payload.billingperiod = Number(this.state.billingPeriod)

    payload.nodes = this.state.nodes.map((node, index) => {
      let returnObj = {
        networkaddress: node.nodeAddress,
        paymentaddress: node.paymentAddress
      }
      
      return returnObj
    })

    defineAndCreateChain(payload)
    .then(res => {
      if (res && !res.error) {
        Store.dispatch(
          triggerToaster(
            translate('PBAAS.PBAAS_CHAIN_SUBMITTED_DESC') + res,
            translate('PBAAS.PBAAS_CHAIN_SUBMITTED'),
            'success',
            false
          )
        );
      } else {
        console.log(res.error)
        Store.dispatch(
          triggerToaster(
            translate('PBAAS.PBAAS_CHAIN_FAILED_DESC') + (res.error ? res.error.message : translate('INDEX.UNKNOWN_ERROR')),
            translate('PBAAS.PBAAS_CHAIN_FAILED'),
            'error',
            false
          )
        );
      }
    })
  }

  anyErrorsOrIncomplete() {
    if (this.state.chainName.length === 0 || 
        this.state.errors.chainName || 
        this.state.startBlock.length === 0 || 
        this.state.errors.startBlock || 
        this.state.initCost.length === 0 ||
        this.state.errors.initCost ||
        this.state.billingPeriod.length === 0 ||
        this.state.errors.billingPeriod ||
        this.state.paymentAddr.length === 0 ||
        this.state.errors.paymentAddr) {
      return true
    } 
    
    if (this.state.includePremine) {
      if (this.state.premineAmount === 0 ||
        this.state.errors.premineAmount) {
          return true
        }
    }

    if (this.state.isReserveCurrency) {
      if (this.state.initialContribution.length === 0 || 
          this.state.errors.initialContribution || 
          this.state.conversionRate.length === 0 || 
          this.state.errors.conversionRate) {
          return true
      }
  
      if (this.state.publicPreconvert && 
        (this.state.minPreconvert.length === 0 || 
          this.state.errors.minPreconvert || 
          this.state.maxPreconvert.length === 0 || 
          this.state.errors.maxPreconvert ||
          this.state.launchfee.length === 0 || 
          this.state.errors.launchfee )) {
          return true
      }
    }

    if (this.state.rewardEras.length === 0) {
      return true
    } else {
      for (let i = 0; i < this.state.rewardEras.length; i++) {
        let era = this.state.rewardEras[i]

        if (era.initReward.length === 0 || era.errors.initReward) {
          return true
        } else if (i < this.state.rewardEras.length - 1 && 
                  (era.end.length === 0 || era.errors.end)) {
          return true
        }

        if (era.decay.type === EXPONENTIAL) {
          if (era.decay.halving.length === 0 || era.errors.halving) {
            return true
          } else if (era.decay.magnitude.length === 0 || era.errors.magnitude) {
            return true
          }
        }
      }
    }

    if (this.state.nodes.length === 0) {
      return true
    } else {
      for (let i = 0; i < this.state.nodes.length; i++) {
        let node = this.state.nodes[i]

        if (node.paymentAddress.length === 0 || 
            node.errors.paymentAddress || 
            node.nodeAddress.length === 0 ||
            node.errors.nodeAddress) {
              return true
        }
      }
    }

    return false
  }

  render() {
    return PBaaSCreateRender.call(this);
  }
}

const mapStateToProps = (state) => {
  return {
    PBaaSMain: {
      activeSectionPbaas: state.PBaaSMain.activeSectionPbaas,
      formState: state.PBaaSMain.formState,
      rootChainHeight: state.PBaaSMain.rootChainHeight
    }
  };
};

export default connect(mapStateToProps)(PBaaSCreate);