import { loadOrCreateStore } from 'key-store'
import { loadSDK } from '@wallet/sdk'
import { implementations, keyStorePath } from './config'

export async function initSDK () {
  const keyStore = await loadOrCreateStore(keyStorePath)
  return loadSDK(keyStore, implementations)
}
