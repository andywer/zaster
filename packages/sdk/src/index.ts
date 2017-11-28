import { Big as BigNumber } from 'big.js'
import { flatMap } from 'lodash'
import { Asset, Operation, Platform, Transaction, Wallet, AddressBalanceOptions, InitWalletOptions } from '@wallet/platform-api'

export { OperationType } from '@wallet/platform-api'

export type Wallet = Wallet

export type KeyStore = {
  getWalletIDs (): string[],
  readWallet (walletID: string, password: string): Promise<any>,
  saveWallet (walletID: string, password: string, data: any): Promise<void>,
  readWalletPublicData (walletID: string): Promise<any>,
  saveWalletPublicData (walletID: string, data: any): Promise<void>,
  removeWallet (walletID: string): Promise<void>
}

export type SDK = {
  ledger: LedgerAPI,
  wallets: WalletsAPI,
  readonly assets: Asset[],
  getAsset (assetID: string): Asset | null
}

export type SDKTransaction = {
  asset: Asset,
  body: Transaction,
  walletOptions: InitWalletOptions
}

export type LedgerAPI = {
  getAddressBalance (asset: Asset, address: string, options?: AddressBalanceOptions): Promise<BigNumber>,
  getWalletBalance (walletID: string): Promise<BigNumber>,
  getWalletAddress (walletID: string): Promise<string>,
  createTransaction (walletID: string, operations: Operation[], options?: object): Promise<SDKTransaction>,
  sendTransaction (transaction: SDKTransaction): Promise<SDKTransaction>
}

export type WalletsAPI = {
  addWallet (id: string, asset: Asset, privateKey: string, password: string, options?: object): Promise<Wallet>,
  createWallet (id: string, asset: Asset, password: string, options?: object): Promise<Wallet>,
  getWallet (id: string): Promise<Wallet>,
  getWalletIDs (): string[],
  removeWallet (id: string): Promise<void>
}

export type RequestPassword = (wallet: Wallet) => Promise<string>
export type LoadSDKOptions = {
  requestPassword?: RequestPassword
}

const defaultRequestPassword = async () => {
  throw new Error('No requestPassword() function passed to loadSDK().')
}

export function loadSDK (keyStore: KeyStore, platforms: Platform[], { requestPassword = defaultRequestPassword }: LoadSDKOptions = {}): SDK {
  const assets = flatMap(platforms, implementation => implementation.getAssets())
  const instantiateWallet = (asset: Asset, walletID: string) => createWalletInstance({ keyStore, requestPassword }, walletID, asset)

  const getAsset = (assetID: string) => {
    return assets.find(asset => asset.id === assetID || asset.aliases.includes(assetID)) || null
  }
  const getPlatform = (asset: Asset) => {
    const assetsIncludesThisAsset = (assets: Asset[]) => assets.some(platformAsset => platformAsset.id === asset.id)
    const platform = platforms.find(platform => assetsIncludesThisAsset(platform.getAssets()))

    if (platform) {
      return platform
    } else {
      throw new Error(`No platform implementation supporting asset ${asset.id} (${asset.name}) found.`)
    }
  }
  const openWalletByID = async (walletID: string) => {
    const publicData = await keyStore.readWalletPublicData(walletID)

    const assetID = publicData ? publicData.asset : null
    if (!assetID) throw new Error(`Wallet ${walletID} in key store is lacking the 'asset' property in public data.`)

    const asset = getAsset(assetID)
    if (!asset) throw new Error(`No asset matching ${assetID} found. Is the related platform implementation installed?`)

    const platform = getPlatform(asset)
    const wallet = instantiateWallet(asset, walletID)

    return { platform, wallet }
  }

  return {
    get assets (): Asset[] {
      return assets
    },
    getAsset,
    ledger: createLedgerAPI(getPlatform, openWalletByID),
    wallets: createWalletsAPI(keyStore, getPlatform, openWalletByID)
  }
}

function createLedgerAPI (
  getPlatform: (asset: Asset) => Platform,
  openWalletByID: (walletID: string) => Promise<{ platform: Platform, wallet: Wallet }>
): LedgerAPI {
  return {
    async getAddressBalance (asset: Asset, address: string, options: AddressBalanceOptions = {}): Promise<BigNumber> {
      const platform = getPlatform(asset)
      return platform.getAddressBalance(address, options)
    },
    async getWalletBalance (walletID: string): Promise<BigNumber> {
      const { platform, wallet } = await openWalletByID(walletID)
      return platform.getWalletBalance(wallet)
    },
    async getWalletAddress (walletID: string): Promise<string> {
      const { platform, wallet } = await openWalletByID(walletID)
      return platform.getWalletAddress(wallet)
    },
    async createTransaction (walletID: string, operations: Operation[], options?: object): Promise<SDKTransaction> {
      const { platform, wallet } = await openWalletByID(walletID)
      const body = await platform.createTransaction(wallet, operations, options)
      return {
        body,
        asset: wallet.asset,
        walletOptions: await wallet.getOptions()
      }
    },
    async sendTransaction (transaction: SDKTransaction): Promise<SDKTransaction> {
      const platform = getPlatform(transaction.asset)
      await platform.sendTransaction(transaction.body, transaction.walletOptions)
      return transaction
    }
  }
}

function createWalletsAPI (
  keyStore: KeyStore,
  getPlatform: (asset: Asset) => Platform,
  openWalletByID: (walletID: string) => Promise<{ platform: Platform, wallet: Wallet }>
): WalletsAPI {
  const walletsAPI = {
    getWalletIDs () {
      return keyStore.getWalletIDs()
    },
    async addWallet (id: string, asset: Asset, privateKey: string, password: string, options: InitWalletOptions = {}) {
      const platform = getPlatform(asset)
      const requestPassword = async () => password
      const wallet = createWalletInstance({ keyStore, requestPassword }, id, asset)
      await platform.prepareNewWallet(wallet, privateKey, options)
      await keyStore.saveWalletPublicData(id, {
        ...(await keyStore.readWalletPublicData(id)),
        asset: asset.id,
        testnet: options.testnet || false
      })
      return wallet
    },
    async createWallet (id: string, asset: Asset, password: string, options: InitWalletOptions = {}) {
      const platform = getPlatform(asset)
      const privateKey = await platform.createPrivateKey()
      return walletsAPI.addWallet(id, asset, privateKey, password, options)
    },
    async getWallet (id: string) {
      const { wallet } = await openWalletByID(id)
      return wallet
    },
    async removeWallet (walletID: string) {
      await keyStore.removeWallet(walletID)
    }
  }
  return walletsAPI
}

function createWalletInstance (
  { keyStore, requestPassword }: { keyStore: KeyStore, requestPassword: RequestPassword },
  walletID: string,
  asset: Asset
): Wallet {
  const walletInitialized = () => keyStore.getWalletIDs().includes(walletID)

  const wallet = {
    get asset () {
      return asset
    },
    get id () {
      return walletID
    },
    async getOptions (): Promise<InitWalletOptions> {
      const publicData = await keyStore.readWalletPublicData(walletID)
      const { testnet = false } = publicData
      return {
        testnet
      }
    },
    async readPrivate (): Promise<any> {
      const privateData = await keyStore.readWallet(walletID, await requestPassword(wallet))
      return privateData.platform
    },
    async savePrivate (data: any): Promise<void> {
      const password = await requestPassword(wallet)
      const privateData = walletInitialized() ? await keyStore.readWallet(walletID, password) : {}
      return keyStore.saveWallet(walletID, password, { ...privateData, platform: data })
    },
    async readPublic (): Promise<any> {
      const publicData = await keyStore.readWalletPublicData(walletID)
      return publicData.platform
    },
    async savePublic (data: any): Promise<void> {
      const publicData = walletInitialized() ? await keyStore.readWalletPublicData(walletID) : {}
      return keyStore.saveWalletPublicData(walletID, { ...publicData, platform: data })
    }
  }
  return wallet
}
