# Implementation API Specification

Specification for @wallet network implementations.

## Package exports

### `getAssets(): Asset[]`

Returns the assets supported by this implementation.

### `createPrivateKey(): Promise<string>`

Asynchronously returns a unicode string representation of a wallet secret key.

### `getAddressBalance(address: string, ?options: object): Promise<BigInteger>`

Asynchronously retrieves the balance of a given address. The value is always denominated as an integer of the assets smallest possible unit (satoshis for bitcoin, stroops for stellar, ...).

```typescript
type options = {
  testnet?: boolean
}
```

### `getWalletBalance(wallet: Wallet): Promise<BigInteger>`

Asynchronously retrieves the balance of a wallet. The value is always denominated as an integer of the assets smallest possible unit (satoshis for bitcoin, stroops for stellar, ...). This might be just a proxied call of `getAddressBalance()` or trigger some more complex logic, depending on the implementation.


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

### BigInteger

```typescript
// https://www.npmjs.com/package/big-integer
import BigInteger = require('big-integer')
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
