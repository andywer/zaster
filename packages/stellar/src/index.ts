import { Big as BigNumber } from 'big.js'
import { Keypair } from 'stellar-sdk'
import { Asset, Wallet, InitWalletOptions } from '@wallet/platform-api'
import { retrieveAccountData } from './horizon'
export { createTransaction, sendTransaction, signTransaction } from './transactions'

export type PublicWalletData = {
  publicKey: string
}

export type PrivateWalletData = {
  privateKey: string
}

export type StellarWallet = Wallet<PrivateWalletData, PublicWalletData>

export function getAssets (): Asset[] {
  return [
    {
      id: 'XLM',
      aliases: ['stellar', 'lumens'],
      name: 'Stellar Lumens'
    }
  ]
}

export async function createPrivateKey () {
  return Keypair.random().secret()
}

export async function prepareNewWallet (wallet: StellarWallet, privateKey: string, options: InitWalletOptions = {}) {
  const keypair = Keypair.fromSecret(privateKey)

  await wallet.savePrivate({ privateKey })
  await wallet.savePublic({ publicKey: keypair.publicKey() })
}

export type AddressBalanceOptions = { testnet?: boolean }

export async function getAddressBalance (address: string, options: AddressBalanceOptions = {}): Promise<BigNumber> {
  try {
    const balance = getBalance(await retrieveAccountData(address, options))
    return balance
  } catch (error) {
    throw wrapBalanceError(address, error)
  }
}

export async function getWalletBalance (wallet: StellarWallet): Promise<BigNumber> {
  const { publicKey }: PublicWalletData = await wallet.readPublic()
  const { testnet } = await wallet.getOptions()

  try {
    const balance = getBalance(await retrieveAccountData(publicKey, { testnet }))
    return balance
  } catch (error) {
    if (error.message && error.message.status === 404) {
      // Account not found which means the account has not yet been activated yet (= just created), so return a zero balance
      return BigNumber(0)
    }
    throw wrapBalanceError(publicKey, error)
  }
}

export async function getWalletAddress (wallet: StellarWallet): Promise<string> {
  const { publicKey }: PublicWalletData = await wallet.readPublic()
  return publicKey
}

function getBalance (accountData): BigNumber {
  const balanceObject = accountData.balances.find((balance: any) => balance.asset_type === 'native')
  return balanceObject ? BigNumber(balanceObject.balance) : BigNumber(0)
}

function wrapBalanceError (publicKey: string, stellarError): Error {
  const { message } = stellarError
  const reason = typeof message !== 'object' ? message : `${message.status} ${message.title} (${message.type})\n${message.detail}`
  return new Error(`Cannot not get balance for ${publicKey}: ${reason}`)
}
