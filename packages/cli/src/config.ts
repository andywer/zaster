import * as path from 'path'
import { homedir } from 'os'
import * as stellar from '@wallet/stellar'

const defaultKeyStorePath = path.join(homedir(), '.wallets')
const keyStorePath = process.env.WALLET_STORE_PATH || defaultKeyStorePath

const platforms = [
  stellar
]

export {
  platforms,
  keyStorePath
}
