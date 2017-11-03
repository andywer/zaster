import { Big as BigNumber } from 'big.js'
import { flatMap } from 'lodash'
import { Asset, Implementation, KeyStore, Wallet, AddressBalanceOptions } from '@wallet/implementation-api'

export type RequestPassword = (wallet: Wallet) => Promise<string>
export type LoadSDKOptions = {
  requestPassword?: RequestPassword
}

const defaultRequestPassword = async () => {
  throw new Error('No requestPassword() function passed to loadSDK().')
}

export function loadSDK (keyStore: KeyStore, implementations: Implementation[], { requestPassword = defaultRequestPassword }: LoadSDKOptions = {}) {
  const assets = flatMap(implementations, implementation => implementation.getAssets())
  const getImplementation = (assetID: string) => findImplementation(implementations, assetID)
  const openWalletByID = async (walletID: string) => openWallet({ keyStore, implementations, requestPassword }, walletID)

  return {
    get assets (): Asset[] {
      return assets
    },
    getWalletIDs (): string[] {
      return keyStore.getWalletIDs()
    },
    async getAddressBalance (asset: string, address: string, options: AddressBalanceOptions = {}): Promise<BigNumber> {
      const implementation = getImplementation(asset)
      return implementation.getAddressBalance(address, options)
    },
    async getWalletBalance (walletID: string): Promise<BigNumber> {
      const { implementation, wallet } = await openWalletByID(walletID)
      return implementation.getWalletBalance(wallet)
    }
  }
}

async function openWallet (
  { keyStore, implementations, requestPassword }: { keyStore: KeyStore, implementations: Implementation[], requestPassword: RequestPassword },
  walletID: string
): Promise<{ implementation: Implementation, wallet: Wallet }> {
  const publicData = await keyStore.readWalletPublicData(walletID)

  if (!publicData.asset) throw new Error(`Wallet ${walletID} in key store is lacking the 'asset' property in public data.`)
  const assetID = publicData.asset

  const implementation = findImplementation(implementations, assetID)
  const asset = implementation.getAssets().find(asset => asset.id === assetID || asset.aliases.some(alias => alias === assetID))
  if (!asset) throw new Error(`Implementation (${implementation.getAssets().map(asset => asset.id).join(', ')}) does not support asset ${assetID}.`)

  const wallet = createWalletInstance({ keyStore, requestPassword }, walletID, asset)
  return { implementation, wallet }
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
      return privateData.impl
    },
    async savePrivate (data: any): Promise<void> {
      const password = await requestPassword(wallet)
      const privateData = await keyStore.readWallet(walletID, password)
      return keyStore.saveWallet(walletID, password, { ...privateData, impl: data })
    },
    async readPublic (): Promise<any> {
      const publicData = await keyStore.readWalletPublicData(walletID)
      return publicData.impl
    },
    async savePublic (data: any): Promise<void> {
      const publicData = await keyStore.readWalletPublicData(walletID)
      return keyStore.saveWalletPublicData(walletID, { ...publicData, impl: data })
    }
  }
  return wallet
}

function findImplementation (implementations: Implementation[], assetID: string): Implementation {
  const assetByIdOrAlias = (asset: Asset) => asset.id === assetID || asset.aliases.some(alias => alias === assetID)
  const implementationByAssetID = (impl: Implementation) => impl.getAssets().some(assetByIdOrAlias)

  const implementation = implementations.find(implementationByAssetID)
  if (implementation) {
    return implementation
  } else {
    throw new Error(`Unhandled asset: ${assetID}. No matching implementation found.`)
  }
}
