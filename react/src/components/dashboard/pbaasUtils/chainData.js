import { fromSats } from 'agama-wallet-lib/src/utils';
const LINEAR_DECAY = 100000000

export const estimateReward = (chainDefinition, latestHeight) => {
  const eras = chainDefinition.eras
  const lastHeight = Number(latestHeight);
  let eraIndex = 0;
  let reward = 0;

  while (
    eraIndex < eras.length && 
    Number(eras[eraIndex].eraend) != 0 && 
    lastHeight > Number(eras[eraIndex].eraend)) { 
    eraIndex++;
  }

  let currentEra = eras[eraIndex]

  if (Number(currentEra.decay) === LINEAR_DECAY) {
    //If decay is linear, create y=mx+b line function to estimate reward
    let yChange = ((eraIndex < eras.length - 1) ? Number(eras[eraIndex + 1].reward) : 0) - Number(currentEra.reward)
    let xChange = Number(currentEra.eraend) - (eraIndex === 0 ? 0 : Number(eras[eraIndex - 1].eraend))
    reward = fromSats((yChange/xChange)*(lastHeight) + Number(currentEra.reward))
  } else {
    //If decay is halving, calculate how many halvings there have been
    let xChange = lastHeight - (eraIndex === 0 ? 0 : Number(eras[eraIndex - 1].eraend))

    let decay = Number(currentEra.decay) === 0 ? 
      (LINEAR_DECAY/2) 
    : 
      Number(currentEra.decay)
    
    reward = fromSats((Number(currentEra.reward))/
            (Math.pow(LINEAR_DECAY/(decay), Math.floor(xChange/Number(currentEra.halving)))))
  }

  return reward
}