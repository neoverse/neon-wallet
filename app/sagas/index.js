// @flow
import { select, all, takeEvery } from 'redux-saga/effects'
import { type Saga } from 'redux-saga'

import actionSaga from './actionSaga'
import { actionTypeMatcher } from '../util/api/matchers'
import { ACTION_REQUEST, type ActionState } from '../values/api'

function asyncAction (actionState: ActionState) {
  return actionTypeMatcher(ACTION_REQUEST)(actionState)
}

export default function * root (): Saga<void> {
  const state = yield select()

  yield all([
    takeEvery(asyncAction, actionSaga, state)
  ])
}
