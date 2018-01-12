// @flow
import createRequestActions from '../util/api/createRequestActions'
import { NETWORK } from '../core/constants'

type Props = {
  net: string
}

export const ID = 'NETWORK'

export default createRequestActions(ID, ({ net }: Props = {}) => (state: Object) => {
  return net || NETWORK.MAIN
})
