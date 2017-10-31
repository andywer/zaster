import { flatMap } from 'lodash'
import { KeyStore, Implementation, Asset } from '@wallet/implementation-api'

const defaultRequestPassword = () => {
  throw new Error('No requestPassword() function passed to loadSDK().')
}

export function loadSDK (keyStore: KeyStore, implementations: Implementation[], { requestPassword = defaultRequestPassword } = {}) {
  const assets = flatMap(implementations, implementation => implementation.getAssets())

  return {
    get assets (): Asset[] {
      return assets
    }
  }
}
