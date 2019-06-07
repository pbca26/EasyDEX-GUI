import Config from '../../config';
import translate from '../../translate/translate';

const addCoinOptionsCustom = () => {
  let coinOptions = [{
    label: 'Verus (VRSC)',
    icon: 'btc/vrsc',
    value: 'VRSC|native|spv',
  }]

  if (Config.enableVrsctest) {
    coinOptions.push({
      label: 'Verus Testnet (VRSCTEST)',
      icon: 'btc/vrsctest',
      value: 'VRSCTEST|native',
    })

    if (Config.pbaasChains.length > 0) {
      coinOptions = coinOptions.concat(
        Config.pbaasChains.map((pbaasChain, index) => {
          return ({
            label: translate(`CRYPTO.${pbaasChain}`),
            icon: '',
            value: `${pbaasChain}|native`,
          })
        }
      ))
    }
  }

  return coinOptions;
}

export default addCoinOptionsCustom;