import { Big as BigNumber } from 'big.js'
import { Asset, Wallet } from '@wallet/implementation-api'
import { getHorizonServer, useNetwork } from './horizon'

type WalletData = {
  publicKey: string,
  testnet: boolean
}

export function getAssets (): Asset[] {
  return [
    {
      id: 'XLM',
      aliases: ['stellar', 'lumens'],
      name: 'Stellar Lumens'
    }
  ]
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

export async function getWalletBalance (wallet: Wallet): Promise<BigNumber> {
  const { publicKey, testnet }: WalletData = await wallet.readPublic()

  return getAddressBalance(publicKey, { testnet })
}
