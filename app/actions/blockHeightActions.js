// @flow
import { api } from 'neon-js'

import createRequestActions from '../util/api/createRequestActions'
// import asyncWrap from '../core/asyncHelper'

type Props = {
  net: string
}

export const ID = 'BLOCK_HEIGHT'

export default createRequestActions(ID, ({ net }: Props = {}) => async (state: Object) => {
  return api.neonDB.getWalletDBHeight(net)
})
