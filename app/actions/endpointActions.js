// @flow
import { api } from 'neon-js'

import createApiActions from '../util/api/createApiActions'

type Props = {
  net: string
}

export const ENDPOINT_ACTIONS_ID = 'ENDPOINT'

export default createApiActions(ENDPOINT_ACTIONS_ID, ({ net }: Props = {}) => (state: Object) => {
  return api.neonDB.getAPIEndpoint(net)
})
