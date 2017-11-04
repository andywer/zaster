import { Big as BigNumber } from 'big.js'

export type KeyStore = {
  getWalletIDs (): string[],
  readWallet(walletID: string, password: string): Promise<any>,
  saveWallet(walletID: string, password: string, data: any): Promise<void>,
  readWalletPublicData(walletID: string): Promise<any>,
  saveWalletPublicData(walletID: string, data: any): Promise<void>,
  removeWallet(walletID: string): Promise<void>
}

export type Platform = {
  createPrivateKey (): Promise<string>,
  getAssets (): Asset[],
  getAddressBalance (address: string, options?: AddressBalanceOptions): Promise<BigNumber>
  getWalletBalance (wallet: Wallet): Promise<BigNumber>
}

export type Asset = {
  id: string,
  aliases: string[],
  name: string
}

// Internal wallet as used by implementations
export type Wallet<WalletPrivateData = any, WalletPublicData = any> = {
  asset: Asset,
  readPrivate: () => Promise<WalletPrivateData>,
  savePrivate: (data: WalletPrivateData) => Promise<void>,
  readPublic: () => Promise<WalletPublicData>,
  savePublic: (data: WalletPublicData) => Promise<void>
}

export type AddressBalanceOptions = { testnet?: boolean }
