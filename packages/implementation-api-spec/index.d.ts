export type KeyStore = {
  getWalletIDs (): string[],
  readWallet(walletID: string, password: string): Promise<any>,
  saveWallet(walletID: string, password: string, data: any): Promise<void>,
  readWalletPublicData(walletID: string): Promise<any>,
  saveWalletPublicData(walletID: string, data: any): Promise<void>,
  removeWallet(walletID: string): Promise<void>
}

export type Implementation = {
  getAssets (): Asset[]
}

export type Asset = {
  id: string,
  aliases: string[],
  name: string
}

export type Wallet<WalletPrivateData = any, WalletPublicData = any> = {
  asset: Asset,
  readPrivate: () => Promise<WalletPrivateData>,
  savePrivate: (data: WalletPrivateData) => Promise<void>,
  readPublic: () => Promise<WalletPublicData>,
  savePublic: (data: WalletPublicData) => Promise<void>
}
