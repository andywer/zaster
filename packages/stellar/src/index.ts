import { Big as BigNumber } from 'big.js'
import { Keypair } from 'stellar-sdk'
import { Asset, Wallet, InitWalletOptions } from '@wallet/platform-api'
import { getHorizonServer, useNetwork } from './horizon'

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

export async function initWallet (wallet: StellarWallet, privateKey: string, options: InitWalletOptions = {}) {
  const keypair = Keypair.fromSecret(privateKey)

  await wallet.savePrivate({ privateKey })
  await wallet.savePublic({ publicKey: keypair.publicKey() })
}

export type AddressBalanceOptions = { testnet?: boolean }

export async function getAddressBalance (address: string, options: AddressBalanceOptions = {}): Promise<BigNumber> {
  const { testnet = false } = options
  const horizon = getHorizonServer({ testnet })

  useNetwork({ testnet })
  const account = await horizon.loadAccount(address)

  const balanceObject = account.balances.find((balance: any) => balance.asset_type === 'native')
  return balanceObject ? BigNumber(balanceObject.balance) : BigNumber(0)
}

export async function getWalletBalance (wallet: StellarWallet): Promise<BigNumber> {
  const { publicKey }: PublicWalletData = await wallet.readPublic()
  const { testnet } = await wallet.getOptions()

  try {
    const balance = await getAddressBalance(publicKey, { testnet })
    return balance
  } catch (error) {
    const reason = typeof error.message !== 'object' ? error.message : `${error.message.status} ${error.message.title} (${error.message.type})\n${error.message.detail}`
    throw new Error(`Cannot not get balance for ${publicKey}: ${reason}`)
  }
}
