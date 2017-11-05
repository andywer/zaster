# @wallet/sdk

Digital payment for the masses. Manage crypto funds with ease.

## API

### `loadSDK(keyStore: KeyStore, platforms: Platform[], { requestPassword: Function }): SdkInstance`

Initialize an SDK instance.

`KeyStore` denotes a key store as returned by the loader functions of the `key-store` package.

```typescript
type requestPassword = (wallet: Wallet) => Promise<string>
```

### `SdkInstance.assets: Asset[]`

Read-only array of assets supported by the implementations that were passed to `loadSdk()`.

### `SdkInstance.getAsset(assetID: string): Asset|null`

Returns the matching asset or `null`. Checks assets' IDs and aliases.

### `SdkInstance.ledger.getAddressBalance(asset: Asset, address: string, options: AddressBalanceOptions = {}): Promise<BigNumber>`

Asynchronously returns the balance of a given address in a given ledger.

### `SdkInstance.ledger.getWalletBalance(walletID: string): Promise<BigNumber>`

Asynchronously returns the balance of a wallet.

### `SdkInstance.wallets.getWalletIDs(): string[]`

Returns the IDs of all wallets.

### `SdkInstance.wallets.addWallet(id: string, asset: Asset, privateKey: string, password: string, options: object = {}): Promise<Wallet>`

Creates a new wallet with the given private key.

```typescript
options: {
  testnet?: boolean
}
```

### `SdkInstance.wallets.createWallet(id: string, asset: Asset, password: string, options: object = {}): Promise<Wallet>`

Creates a new wallet with a new random private key.

```typescript
options: {
  testnet?: boolean
}
```

### `SdkInstance.wallets.getWallet(id: string): Promise<Wallet>`

Returns the wallet with the given `id` or throws an error.

### `SdkInstance.wallets.removeWallet(walletID: string): Promise<void>`

Removes the wallet matching the `id`.


## Types

### Asset
### Wallet

See the [Platform API readme](../platform-api-spec/README.md#types).


## To Do

**Attention: This is work in progress and far from complete.**
