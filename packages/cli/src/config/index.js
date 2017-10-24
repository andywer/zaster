import path from 'path'
import { homedir } from 'os'
import * as implementations from './implementations'

const defaultKeyStorePath = path.join(homedir(), '.wallets')
const keyStorePath = process.env.WALLET_STORE_PATH || defaultKeyStorePath

export {
  implementations,
  keyStorePath
}
