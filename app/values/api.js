// @flow
export type ActionProp = '__performAction__'
export type ProgressProp = '__progress__'

export const ACTION_PROP: ActionProp = '__performAction__'
export const PROGRESS_PROP: ProgressProp = '__progress__'

export type ActionType = 'API/REQUEST' | 'API/RETRY' | 'API/CANCEL' | 'API/SUCCESS' | 'API/FAILURE' | 'API/RESET'

export const ACTION_REQUEST: ActionType = 'API/REQUEST'
export const ACTION_RETRY: ActionType = 'API/RETRY'
export const ACTION_CANCEL: ActionType = 'API/CANCEL'
export const ACTION_SUCCESS: ActionType = 'API/SUCCESS'
export const ACTION_FAILURE: ActionType = 'API/FAILURE'
export const ACTION_RESET: ActionType = 'API/RESET'

export type ActionTypeMap = {
  REQUEST: string,
  RETRY: string,
  CANCEL: string,
  SUCCESS: string,
  FAILURE: string,
  RESET: string
}

export type Actions = {
  id: string,
  request: Function,
  retry: Function,
  cancel: Function,
  reset: Function,
  actionTypes: ActionTypeMap
}

export type ActionMeta = {
  id: string,
  type: ActionType
}

export type RequestPayload = {
  fn: Function
}

export type ActionState = {
  type: string,
  meta: ActionMeta,
  payload: RequestPayload | any
}

export type Data = Object | null
export type Error = string | null
