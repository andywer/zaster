import { loadOrCreateStore } from 'key-store'
import { loadSDK, Wallet } from '@wallet/sdk'
import { platforms, keyStorePath } from './config'
import { readPassword } from './tty'

export async function initSDK () {
  const keyStore = await loadOrCreateStore(keyStorePath)
  const passwords = new Map()
  const requestPassword = async (wallet: Wallet) => {
    if (!passwords.has(wallet.id)) {
      passwords.set(wallet.id, await readPassword())
    }
    return passwords.get(wallet.id)
  }
  return loadSDK(keyStore, platforms, { requestPassword })
}
