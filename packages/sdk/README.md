# @wallet/sdk

Digital payment for the masses. Manage crypto funds with ease.

## API

### `loadSDK(keyStore: KeyStore, implementations: Implementation[], { requestPassword: Function }): SdkInstance`

Initialize an SDK instance.

`KeyStore` denotes a key store as returned by the loader functions of the `key-store` package.

```typescript
type requestPassword = (wallet: Wallet) => Promise<string>
```

### `SdkInstance.assets: Asset[]`

Read-only array of assets supported by the implementations that were passed to `loadSdk()`.


## Types

### Asset
### Wallet

See the [Implementation API readme](../implementation-api-spec/README.md#types).


## To Do

**Attention: This is work in progress and far from complete.**
