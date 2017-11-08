import { loadOrCreateStore } from 'key-store'
import { loadSDK } from '@wallet/sdk'
import { platforms, keyStorePath } from './config'
import { readPassword } from './tty'

export async function initSDK () {
  const keyStore = await loadOrCreateStore(keyStorePath)
  const requestPassword = async () => readPassword()
  return loadSDK(keyStore, platforms, { requestPassword })
}
