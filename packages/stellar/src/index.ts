import { Big as BigNumber } from 'big.js'
import { Keypair } from 'stellar-sdk'
import { Asset, Wallet } from '@wallet/implementation-api'
import { getHorizonServer, useNetwork } from './horizon'

export type PublicWalletData = {
  publicKey: string,
  testnet: boolean
}

export type StellarWallet = Wallet<any, PublicWalletData>

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
  const { publicKey, testnet }: PublicWalletData = await wallet.readPublic()

  return getAddressBalance(publicKey, { testnet })
}
