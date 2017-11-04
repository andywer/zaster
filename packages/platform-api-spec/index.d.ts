import { Big as BigNumber } from 'big.js'

export type Platform = {
  getAssets (): Asset[],
  createPrivateKey (): Promise<string>,
  getAddressBalance (address: string, options?: AddressBalanceOptions): Promise<BigNumber>,
  getWalletBalance (wallet: Wallet): Promise<BigNumber>,
  initWallet (wallet: Wallet, privateKey: string, options?: InitWalletOptions): Promise<void>
}

export type AddressBalanceOptions = { testnet?: boolean }
export type InitWalletOptions = { testnet?: boolean }

export type Asset = {
  id: string,
  aliases: string[],
  name: string
}

// Internal wallet as used by platforms
export type Wallet<WalletPrivateData = any, WalletPublicData = any> = {
  asset: Asset,
  readPrivate: () => Promise<WalletPrivateData>,
  savePrivate: (data: WalletPrivateData) => Promise<void>,
  readPublic: () => Promise<WalletPublicData>,
  savePublic: (data: WalletPublicData) => Promise<void>
}
