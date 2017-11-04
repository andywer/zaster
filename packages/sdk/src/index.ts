import { Big as BigNumber } from 'big.js'
import { flatMap } from 'lodash'
import { Asset, KeyStore, Platform, Wallet, AddressBalanceOptions } from '@wallet/platform-api'

export type RequestPassword = (wallet: Wallet) => Promise<string>
export type LoadSDKOptions = {
  requestPassword?: RequestPassword
}

const defaultRequestPassword = async () => {
  throw new Error('No requestPassword() function passed to loadSDK().')
}

export function loadSDK (keyStore: KeyStore, platforms: Platform[], { requestPassword = defaultRequestPassword }: LoadSDKOptions = {}) {
  const assets = flatMap(platforms, implementation => implementation.getAssets())
  const getPlatform = (assetID: string) => findPlatform(platforms, assetID)
  const openWalletByID = async (walletID: string) => openWallet({ keyStore, platforms, requestPassword }, walletID)

  return {
    get assets (): Asset[] {
      return assets
    },
    getWalletIDs (): string[] {
      return keyStore.getWalletIDs()
    },
    async getAddressBalance (asset: string, address: string, options: AddressBalanceOptions = {}): Promise<BigNumber> {
      const platform = getPlatform(asset)
      return platform.getAddressBalance(address, options)
    },
    async getWalletBalance (walletID: string): Promise<BigNumber> {
      const { platform, wallet } = await openWalletByID(walletID)
      return platform.getWalletBalance(wallet)
    }
  }
}

async function openWallet (
  { keyStore, platforms, requestPassword }: { keyStore: KeyStore, platforms: Platform[], requestPassword: RequestPassword },
  walletID: string
): Promise<{ platform: Platform, wallet: Wallet }> {
  const publicData = await keyStore.readWalletPublicData(walletID)

  if (!publicData.asset) throw new Error(`Wallet ${walletID} in key store is lacking the 'asset' property in public data.`)
  const assetID = publicData.asset

  const platform = findPlatform(platforms, assetID)
  const asset = platform.getAssets().find(asset => asset.id === assetID || asset.aliases.some(alias => alias === assetID))
  if (!asset) throw new Error(`Platform (${platform.getAssets().map(asset => asset.id).join(', ')}) does not support asset ${assetID}.`)

  const wallet = createWalletInstance({ keyStore, requestPassword }, walletID, asset)
  return { platform, wallet }
}

function createWalletInstance (
  { keyStore, requestPassword }: { keyStore: KeyStore, requestPassword: RequestPassword },
  walletID: string,
  asset: Asset
): Wallet {
  const wallet = {
    asset,
    async readPrivate (): Promise<any> {
      const privateData = await keyStore.readWallet(walletID, await requestPassword(wallet))
      return privateData.platform
    },
    async savePrivate (data: any): Promise<void> {
      const password = await requestPassword(wallet)
      const privateData = await keyStore.readWallet(walletID, password)
      return keyStore.saveWallet(walletID, password, { ...privateData, platform: data })
    },
    async readPublic (): Promise<any> {
      const publicData = await keyStore.readWalletPublicData(walletID)
      return publicData.platform
    },
    async savePublic (data: any): Promise<void> {
      const publicData = await keyStore.readWalletPublicData(walletID)
      return keyStore.saveWalletPublicData(walletID, { ...publicData, platform: data })
    }
  }
  return wallet
}

function findPlatform (platforms: Platform[], assetID: string): Platform {
  const assetByIdOrAlias = (asset: Asset) => asset.id === assetID || asset.aliases.some(alias => alias === assetID)
  const platformByAssetID = (platform: Platform) => platform.getAssets().some(assetByIdOrAlias)

  const platform = platforms.find(platformByAssetID)
  if (platform) {
    return platform
  } else {
    throw new Error(`Unhandled asset: ${assetID}. No matching platform found.`)
  }
}
