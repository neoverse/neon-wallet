// @flow
import { get } from 'lodash'

import blockHeightActions from '../actions/blockHeightActions'
import { ID as NETWORK_ID } from '../actions/networkActions'
import { ID as SETTINGS_ID } from '../actions/settingsActions'
import { getNetworks } from '../core/networks'

const PREFIX = 'api'

// TODO: Module functions that inspect state such as `doClaimNotify` should be refactored into
//       higher-order components that expose function props for performing these actions.  Data that
//       is normally provided by functions like `getNetwork` can instead be retrieved via the
//       `withData` higher-order component.

export const getNetworkId = (state: Object) => {
  return get(state, `${PREFIX}.${NETWORK_ID}.data`)
}

export const getNetwork = (state: Object) => {
  const selectedNetworkId = getNetworkId(state)
  const networks = getNetworks()
  const networkItem = networks.find(({ id, value }) => id === selectedNetworkId) || networks[0]

  return networkItem.network
}

export const getNetworkById = (networkId: string) => {
  const networks = getNetworks()
  const networkItem = networks.find(({ id, value }) => id === networkId) || networks[0]
  return networkItem.network
}

export const getCurrency = (state: Object) => {
  return get(state, `${PREFIX}.${SETTINGS_ID}.data.currency`)
}

export const getTokensForNetwork = (state: Object) => {
  const selectedNetworkId = getNetworkId(state)
  const allTokens = get(state, `${PREFIX}.${SETTINGS_ID}.data.tokens`)
  return allTokens.filter(({ networkId }) => networkId === selectedNetworkId)
}

export const syncBlockHeight = (state: Object) => {
  return blockHeightActions.request({ networkId: getNetworkId(state) })
}
