// @flow
import {
  ACTION_REQUEST,
  ACTION_RETRY,
  ACTION_CANCEL,
  ACTION_SUCCESS,
  ACTION_FAILURE,
  ACTION_RESET,
  type ActionTypeMap
} from '../../values/api'

export default function createActionTypes (statePath: string): ActionTypeMap {
  return {
    REQUEST: `${statePath}/${ACTION_REQUEST}`,
    RETRY: `${statePath}/${ACTION_RETRY}`,
    CANCEL: `${statePath}/${ACTION_CANCEL}`,
    SUCCESS: `${statePath}/${ACTION_SUCCESS}`,
    FAILURE: `${statePath}/${ACTION_FAILURE}`,
    RESET: `${statePath}/${ACTION_RESET}`
  }
}
