// @flow
import { wallet } from 'neon-js'
import { noop } from 'lodash'

import createRequestActions from '../util/api/createRequestActions'
import { upgradeNEP6AddAddresses } from '../core/account'
import { validatePassphraseLength } from '../core/wallet'

type WifLoginProps = {
  wif: string
}

type LedgerLoginProps = {
  signingFunction: Function,
  publicKey: string
}

type Nep2LoginProps = {
  passphrase: string,
  encryptedWIF: string
}

type AccountType = {
  wif: ?string,
  address: string
}

export const ID = 'ACCOUNT'

export const wifLoginActions = createRequestActions(ID, ({ wif }: WifLoginProps) => (state: Object): AccountType => {
  const account = new wallet.Account(wif)
  return { wif, address: account.address }
})

export const ledgerLoginActions = createRequestActions(ID, ({ signingFunction, publicKey }: LedgerLoginProps) => (state: Object): AccountType => {
  // TODO: we're not using signingFunction here, so do we need it?  Or is it for a later step in the ledger login process?
  const publicKeyEncoded = wallet.getPublicKeyEncoded(publicKey)
  const account = new wallet.Account(publicKeyEncoded)
  return { wif: null, address: account.address }
})

export const nep2LoginActions = createRequestActions(ID, ({ passphrase, encryptedWIF }: Nep2LoginProps) => async (state: Object): Promise<AccountType> => {
  if (!validatePassphraseLength(passphrase)) {
    throw new Error('Passphrase too short')
  }

  if (!wallet.isNEP2(encryptedWIF)) {
    throw new Error('That is not a valid encrypted key')
  }

  const wif = wallet.decrypt(encryptedWIF, passphrase)
  const account = new wallet.Account(wif)

  await upgradeNEP6AddAddresses(encryptedWIF, wif)

  return { wif, address: account.address }
})

// TODO: better way to expose action data than to make a faux function?
export default createRequestActions(ID, () => (state: Object) => noop)
