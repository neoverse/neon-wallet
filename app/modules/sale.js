// @flow
import { wallet, api } from 'neon-js'
import { flatten } from 'lodash'

import { showErrorNotification, showInfoNotification, hideNotification } from './notifications'
import {
  getNetwork,
  getWIF,
  getAddress,
  getIsHardwareLogin,
  getSigningFunction,
  getPublicKey,
  getNEO,
  getGAS
} from '../core/deprecated'
import { toNumber } from '../core/math'
import { ASSETS } from '../core/constants'
import { validateMintTokensInputs, validateOldMintTokensInputs } from '../core/sale'
import { oldMintTokens } from '../core/oldMintTokens'

const ERROR_PREFIX = 'Sale participation failed'

export const participateInSale = (
  neoToSend: string,
  gasToSend: string,
  scriptHash: string,
  gasCost: string = '0'
) => async (dispatch: DispatchType, getState: GetStateType) => {
  const state = getState()
  const wif = getWIF(state)
  const publicKey = getPublicKey(state)
  const NEO = toNumber(getNEO(state))
  const GAS = toNumber(getGAS(state))
  const net = getNetwork(state)
  const address = getAddress(state)
  const isHardwareLogin = getIsHardwareLogin(state)
  const signingFunction = getSigningFunction(state)

  const account = new wallet.Account(wif)
  const neoToMint = toNumber(neoToSend)
  const gasToMint = toNumber(gasToSend)

  const [isValid, message] = validateMintTokensInputs(
    neoToMint,
    gasToMint,
    scriptHash,
    NEO,
    GAS
  )

  if (!isValid) {
    dispatch(showErrorNotification({ message }))
    return false
  }

  const formattedScriptHash = scriptHash.length === 40
    ? scriptHash
    : scriptHash.slice(2, scriptHash.length)

  let notificationId

  if (isHardwareLogin) {
    notificationId = dispatch(
      showInfoNotification({
        message: 'Please sign the transaction on your hardware device',
        autoDismiss: 0
      })
    )
  } else {
    notificationId = dispatch(
      showInfoNotification({ message: 'Sending transaction', autoDismiss: 0 })
    )
  }

  const scriptHashAddress = wallet.getAddressFromScriptHash(formattedScriptHash)

  const intents = [[ASSETS.NEO, neoToMint], [ASSETS.GAS, gasToMint]]
    .filter(([symbol, amount]) => amount > 0)
    .map(([symbol, amount]) =>
      api.makeIntent({ [symbol]: amount }, scriptHashAddress)
    )

  const script = {
    scriptHash: formattedScriptHash,
    operation: 'mintTokens',
    args: []
  }
  const config = {
    net,
    address,
    privateKey: isHardwareLogin ? null : account.privateKey,
    intents: flatten(intents),
    script,
    gas: 0,
    publicKey: isHardwareLogin ? publicKey : null,
    signingFunction: isHardwareLogin ? signingFunction : null
  }

  try {
    const response = await api.doInvoke(config)

    if (!response || !response.response || !response.response.result) {
      throw new Error('Rejected by RPC server.')
    }
  } catch (err) {
    dispatch(showErrorNotification({ message: `${ERROR_PREFIX}: ${err.message}` }))
    return false
  }

  // $FlowFixMe
  dispatch(hideNotification(notificationId))
  return true
}

export const oldParticipateInSale = (
  neoToSend: string,
  scriptHash: string,
  gasCost: string = '0'
) => async (dispatch: DispatchType, getState: GetStateType) => {
  const state = getState()
  const wif = getWIF(state)
  const NEO = toNumber(getNEO(state))
  const GAS = toNumber(getGAS(state))
  const publicKey = getPublicKey(state)
  const net = getNetwork(state)
  const isHardwareLogin = getIsHardwareLogin(state)
  const signingFunction = getSigningFunction(state)

  const neoToMint = toNumber(neoToSend)
  const [isValid, message] = validateOldMintTokensInputs(
    neoToMint,
    scriptHash,
    NEO,
    GAS
  )

  if (!isValid) {
    dispatch(showErrorNotification({ message }))
    return false
  }

  const formattedScriptHash =
    scriptHash.length === 40
      ? scriptHash
      : scriptHash.slice(2, scriptHash.length)

  let notificationId: any

  if (isHardwareLogin) {
    notificationId = dispatch(
      showInfoNotification({
        message: 'Please sign the transaction on your hardware device',
        autoDismiss: 0
      })
    )
  } else {
    notificationId = dispatch(
      showInfoNotification({ message: 'Sending transaction', autoDismiss: 0 })
    )
  }

  const wifOrPublicKey = isHardwareLogin ? publicKey : wif

  try {
    const response = await oldMintTokens(
      net,
      formattedScriptHash,
      wifOrPublicKey,
      neoToMint,
      0,
      signingFunction
    )

    if (!response || !response.result) {
      throw new Error('Rejected by RPC server.')
    }
  } catch (err) {
    dispatch(showErrorNotification({ message: `${ERROR_PREFIX}: ${err.message}` }))
    return false
  }

  // $FlowFixMe
  dispatch(hideNotification(notificationId))
  return true
}
