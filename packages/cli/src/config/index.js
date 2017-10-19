import path from 'path'
import { homedir } from 'os'
import * as implementations from './implementations'

const keyStorePath = path.join(homedir(), '.wallets')

export {
  implementations,
  keyStorePath
}
