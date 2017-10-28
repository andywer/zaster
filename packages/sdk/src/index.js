import { flatMap } from 'lodash'

const defaultRequestPassword = () => {
  throw new Error('No requestPassword() function passed to loadSDK().')
}

export function loadSDK (keyStore, implementations, { requestPassword = defaultRequestPassword } = {}) {
  const assets = flatMap(implementations, implementation => implementation.getAssets())

  return {
    get assets () {
      return assets
    }
  }
}
