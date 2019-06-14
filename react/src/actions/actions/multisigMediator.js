import {
  DASHBOARD_MULTISIG_PROPOSALS,
} from '../storeType';
import translate from '../../translate/translate';
import Config, {
  token,
  agamaPort,
} from '../../config';
import {
  triggerToaster,
} from '../actionCreators';
import Store from '../../store';
import urlParams from '../../util/url';
import fetchType from '../../util/fetchType';
import mainWindow from '../../util/mainWindow';

const endPointUrl = 'http://localhost:8115';

// TODO: dev display errors

// src: atomicexplorer
/*export const apiGetRemoteTimestamp = () => {
  return new Promise((resolve, reject) => {
    fetch(
      'https://www.atomicexplorer.com/api/timestamp/now',
      fetchType.get
    )
    .catch((error) => {
      console.log(error);
      resolve({ msg: 'error' });
    })
    .then(response => response.json())
    .then(json => {
      resolve(json);
    });
  });
}*/

export const apiProposalsListState = (json) => {
  return {
    type: DASHBOARD_MULTISIG_PROPOSALS,
    multisigProposals: json.msg && json.msg === 'success' ? json.result : { error: json.result },
  }
}

export const apiProposalsList = (coin, pubkey, redeemscript, sig, message, iszcash = false) => {
  return dispatch => {
    const _urlParams = {
      //token,
      coin,
      pubkey,
      redeemscript,
      sig,
      message,
      iszcash,
    };
    return fetch(
      `${endPointUrl}/api/multisig/storage/list${urlParams(_urlParams)}`,
      fetchType.get
    )
    .catch((error) => {
      console.log(error);
      dispatch(
        triggerToaster(
          translate('API.apiProposalsList') + ' (code: apiProposalsList)',
          translate('TOASTR.ERROR'),
          'error'
        )
      );
    })
    .then(response => response.json())
    .then(json => {
      dispatch(apiProposalsListState(json));
    });
  }
}
/*  History format: encrypted JSON object { timestamp, type, pubkey }
*    type: 0 - created, 1 - sig added, 2 - comment added, 4 - archived, 5 - restored, 6 - published (locked)
*  Content format: encrypted JSON object { timestamp, title: string, pubkey hash: string, raw tx }
*/
export const apiProposalCreate = (coin, pubkey, redeemscript, sig, message, iszcash = false, rawtx) => {
  return new Promise((resolve, reject) => {
    const content = JSON.stringify({
      timestamp: Date.now(),
      title: 'proposal test',
      pubkey,
      rawtx,
    });
    const _urlParams = {
      //token,
      coin,
      pubkey,
      redeemscript,
      sig,
      message,
      iszcash,
      content,
    };
    fetch(
      `${endPointUrl}/api/multisig/storage/new${urlParams(_urlParams)}`,
      fetchType.get
    )
    .catch((error) => {
      console.log(error);
      dispatch(
        triggerToaster(
          translate('API.apiProposalCreate') + ' (code: apiProposalCreate)',
          translate('TOASTR.ERROR'),
          'error'
        )
      );
    })
    .then(response => response.json())
    .then(json => {
      console.warn('apiProposalCreate', json);
      resolve(true);
    });
  });
}

export const apiProposalUpdate = (coin, id, pubkey, redeemscript, sig, message, iszcash = false, content, broadcast) => {
  return new Promise((resolve, reject) => {
    let _urlParams = {
      //token,
      id,
      coin,
      pubkey,
      redeemscript,
      sig,
      message,
      iszcash,
      content: JSON.stringify(content),
    };

    if (broadcast) {
      _urlParams.broadcast = true;
    }

    fetch(
      `${endPointUrl}/api/multisig/storage/update${urlParams(_urlParams)}`,
      fetchType.get
    )
    .catch((error) => {
      console.log(error);
      dispatch(
        triggerToaster(
          translate('API.apiProposalUpdate') + ' (code: apiProposalUpdate)',
          translate('TOASTR.ERROR'),
          'error'
        )
      );
    })
    .then(response => response.json())
    .then(json => {
      console.warn('apiProposalUpdate', json);
      resolve(true);
    });
  });
}