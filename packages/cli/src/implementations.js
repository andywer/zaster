import { flatMap } from 'lodash'
import * as config from './config'

export function init () {
  const assets = initAssets(config.implementations)
  return {
    assets
  }
}

function initAssets (implementations) {
  const assets = flatMap(implementations, implementation => implementation.getAssets())
  return assets
}
