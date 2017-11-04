# Platform API Specification

Specification for @wallet platform implementations, like Bitcoin, Ethereum, ...


## Package exports

### `getAssets(): Asset[]`

Returns the assets supported by this implementation.

### `createPrivateKey(): Promise<string>`

Asynchronously returns a unicode string representation of a wallet secret key.

### `getAddressBalance(address: string, ?options: object): Promise<BigNumber>`

Asynchronously retrieves the balance of a given address. The value is always denominated in the asset's usually used unit (bitcoin, not satoshis; stellar lumens, not stroops, ...).

```typescript
type options = {
  testnet?: boolean
}
```

### `getWalletBalance(wallet: Wallet): Promise<BigNumber>`

Asynchronously retrieves the balance of a wallet. The value is always denominated in the asset's usually used unit (bitcoin, not satoshis; stellar lumens, not stroops, ...). This might be just a proxied call of `getAddressBalance()` or trigger some more complex logic, depending on the implementation.


## Types

### Asset

```typescript
type Asset = {
  id: string,
  aliases: string[],
  name: string
}
```

Example:

```js
{
  id: 'XBT',
  aliases: ['btc', 'bitcoin'],
  name: 'Bitcoin'
}
```

### BigNumber

```typescript
// https://www.npmjs.com/package/big.js
import BigNumber = require('big.js')
```

### Wallet

```typescript
type Wallet = {
  asset: Asset,
  readPrivate: () => Promise<WalletData>,
  savePrivate: (data: WalletData) => Promise<void>,
  readPublic: () => Promise<WalletData>,
  savePublic: (data: WalletData) => Promise<void>
}

type WalletData = any
```

A wallet may contain private and public data. Private data will be saved in an encrypted way using a user-supplied password, whereas the public data will be readable without any authentication. You don't need to care for asking the user for a password here; it will automatically be cared for on `readPrivate()`/`savePrivate()` calls.


## To Do

**Attention: This is work in progress and far from complete.**

- `getTransactionHistory({ offset?: number, limit?: number, order?: 'ASC'|'DESC' } /* or date-time-based? maybe two functions? */): Observable<Transaction>`
- `Transaction` type
- `createTransaction(...): Promise<Transaction>`
- `sendTransaction(...): Promise<void>`