// @flow
import createRequestActions from '../util/api/createRequestActions'
import { getStorage } from '../core/storage'
import { DEFAULT_WALLET } from '../core/constants'

type Props = {
  networkId: string
}

export const ID = 'ACCOUNTS'

export default createRequestActions(ID, ({ networkId }: Props = {}) => async (state: Object): Promise<Object> => {
  const userWallet = await getStorage('userWallet') || DEFAULT_WALLET
  return userWallet.accounts
})
