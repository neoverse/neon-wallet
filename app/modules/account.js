// @flow
import { wallet } from 'neon-js'

import { showErrorNotification, showInfoNotification, hideNotification } from './notifications'

import commNode from '../ledger/ledger-comm-node'
import { ledgerNanoSCreateSignatureAsync } from '../ledger/ledgerNanoS'

import { upgradeNEP6AddAddresses } from '../core/account'
import { validatePassphraseLength } from '../core/wallet'
import { BIP44_PATH, ROUTES, FINDING_LEDGER_NOTICE } from '../core/constants'
import asyncWrap from '../core/asyncHelper'

// Constants
export const LOGOUT = 'LOGOUT'
export const HARDWARE_DEVICE_INFO = 'HARDWARE_DEVICE_INFO'
export const HARDWARE_PUBLIC_KEY_INFO = 'HARDWARE_PUBLIC_KEY_INFO'
export const HARDWARE_PUBLIC_KEY = 'HARDWARE_PUBLIC_KEY'
export const HARDWARE_LOGIN = 'HARDWARE_LOGIN'

// Actions
export function logout () {
  return {
    type: LOGOUT
  }
}

export function hardwareDeviceInfo (hardwareDeviceInfo: string) {
  return {
    type: HARDWARE_DEVICE_INFO,
    payload: { hardwareDeviceInfo }
  }
}

export function hardwarePublicKeyInfo (hardwarePublicKeyInfo: ?string) {
  return {
    type: HARDWARE_PUBLIC_KEY_INFO,
    payload: { hardwarePublicKeyInfo }
  }
}

export function hardwarePublicKey (publicKey: ?string) {
  return {
    type: HARDWARE_PUBLIC_KEY,
    payload: { publicKey }
  }
}

export function isHardwareLogin (isHardwareLogin: boolean) {
  return {
    type: HARDWARE_LOGIN,
    payload: { isHardwareLogin }
  }
}

// Reducer that manages account state (account now = private key)
export const ledgerNanoSGetInfoAsync = () => async (dispatch: DispatchType) => {
  const dispatchError = (message: string, deviceInfoMsg: boolean = true) => {
    dispatch(isHardwareLogin(false))
    dispatch(hardwarePublicKey(null))
    if (deviceInfoMsg) {
      dispatch(hardwarePublicKeyInfo(null))
      return dispatch(hardwareDeviceInfo(message))
    } else {
      return dispatch(hardwarePublicKeyInfo(message))
    }
  }
  dispatch(hardwareDeviceInfo(FINDING_LEDGER_NOTICE))
  let [err, result] = await asyncWrap(commNode.list_async())
  if (err) {
    return dispatchError(`Finding USB Error: ${err}. ${FINDING_LEDGER_NOTICE}`)
  }
  if (result.length === 0) {
    return dispatchError(`USB Failure: No device found. ${FINDING_LEDGER_NOTICE}`)
  } else {
    let [err, comm] = await asyncWrap(commNode.create_async())
    if (err) {
      return dispatchError(`Finding USB Error: ${err}. ${FINDING_LEDGER_NOTICE}`)
    }

    const deviceInfo = comm.device.getDeviceInfo()
    comm.device.close()
    dispatch(hardwareDeviceInfo(`Found USB ${deviceInfo.manufacturer} ${deviceInfo.product}`))
  }
  [err, result] = await asyncWrap(commNode.list_async())
  if (result.length === 0) {
    return dispatchError('Hardware Device Error. Login to NEO App and try again', false)
  } else {
    let [err, comm] = await asyncWrap(commNode.create_async())
    if (err) {
      console.log(`Public Key Comm Init Error: ${err}`)
      return dispatchError('Hardware Device Error. Login to NEO App and try again', false)
    }

    let message = Buffer.from(`8004000000${BIP44_PATH}`, 'hex')
    const validStatus = [0x9000]
    let [error, response] = await asyncWrap(comm.exchange(message.toString('hex'), validStatus))
    if (error) {
      comm.device.close() // NOTE: do we need this close here - what about the other errors that do not have it at the moment
      if (error === 'Invalid status 28160') {
        return dispatchError('NEO App does not appear to be open, request for private key returned error 28160.', false)
      } else {
        console.log(`Public Key Comm Messaging Error: ${error}`)
        return dispatchError('Hardware Device Error. Login to NEO App and try again', false)
      }
    }
    comm.device.close()
    dispatch(isHardwareLogin(true))
    dispatch(hardwarePublicKey(response.substring(0, 130)))
    return dispatch(hardwarePublicKeyInfo('Success. NEO App Found on Hardware Device. Click Button Above to Login'))
  }
}

// State Getters
export const getWIF = (state: Object) => state.account.wif
export const getAddress = (state: Object) => state.account.address
export const getLoggedIn = (state: Object) => state.account.loggedIn
export const getRedirectUrl = (state: Object) => state.account.redirectUrl
export const getAccounts = (state: Object) => state.account.accounts
export const getSigningFunction = (state: Object) => state.account.signingFunction
export const getPublicKey = (state: Object) => state.account.publicKey
export const getHardwareDeviceInfo = (state: Object) => state.account.hardwareDeviceInfo
export const getHardwarePublicKeyInfo = (state: Object) => state.account.hardwarePublicKeyInfo
export const getIsHardwareLogin = (state: Object) => state.account.isHardwareLogin

const initialState = {
  wif: null,
  address: null,
  loggedIn: false,
  redirectUrl: null,
  accounts: [],
  signingFunction: null,
  publicKey: null,
  isHardwareLogin: false,
  hardwareDeviceInfo: null,
  hardwarePublicKeyInfo: null
}

export default (state: Object = initialState, action: ReduxAction) => {
  switch (action.type) {
    case LOGOUT:
      return {
        ...state,
        wif: null,
        address: null,
        loggedIn: false,
        signingFunction: null,
        publicKey: null,
        isHardwareLogin: false
      }
    case HARDWARE_DEVICE_INFO:
      const { hardwareDeviceInfo } = action.payload
      return {
        ...state,
        hardwareDeviceInfo
      }
    case HARDWARE_LOGIN:
      const { isHardwareLogin } = action.payload
      return {
        ...state,
        isHardwareLogin
      }
    case HARDWARE_PUBLIC_KEY_INFO:
      const { hardwarePublicKeyInfo } = action.payload
      return {
        ...state,
        hardwarePublicKeyInfo
      }
    case HARDWARE_PUBLIC_KEY:
      const { publicKey } = action.payload
      return {
        ...state,
        publicKey
      }
    default:
      return state
  }
}
