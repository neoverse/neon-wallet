// @flow
import createActionTypes from './createActionTypes'
import { ACTION_REQUEST, ACTION_RETRY, ACTION_CANCEL, ACTION_RESET, type Actions } from '../../values/api'

export default function createApiActions (id: string, createAdaptor: Function): Actions {
  const actionTypes = createActionTypes(id)

  const request = (props: Object) => ({
    type: actionTypes.REQUEST,
    meta: { type: ACTION_REQUEST, id },
    payload: { fn: createAdaptor(props) }
  })

  const retry = (props: Object) => ({
    type: actionTypes.RETRY,
    meta: { type: ACTION_RETRY, id },
    payload: { fn: createAdaptor(props) }
  })

  const cancel = () => ({
    type: actionTypes.CANCEL,
    meta: { type: ACTION_CANCEL, id }
  })

  const reset = () => ({
    type: actionTypes.RESET,
    meta: { type: ACTION_RESET, id }
  })

  return { id, request, retry, cancel, reset, actionTypes }
}
