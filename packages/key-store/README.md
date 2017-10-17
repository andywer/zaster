# @wallet/key-store

Encrypted wallet storage. Saves arbitrary JSON data encrypted using AES-256 to the disk. Supports different passwords for each wallet.

**Attention: The data is stored in a truly secure way. If you loose it you will not be able to recover the wallet data!**

## API

### Exports

#### storeExists(storePath: string): Promise<bool>
#### createStore(storePath: string): Promise<Store>
#### loadStore(storePath: string): Promise<Store>
#### loadOrCreateStore(storePath: string): Promise<Store>

### Store

#### store.getWalletIDs(): string[]
#### store.readWallet(walletID: string, password: string): WalletData
#### store.saveWallet(walletID: string, password: string, data: WalletData): Promise
#### store.removeWallet(walletID: string): Promise

#### WalletData

Can be any kind of value that is JSON encodable/decodable (object, array, string, ...).


## Example

```js
import { loadStore } from '@wallet/key-store'

const store = await loadStore('~/.wallets')
const allWalletIDs = await store.getWalletIDs()

console.log(`All available wallets: ${allWalletIDs.join(', ')}`)

await store.saveWallet('my-wallet', 'arbitrary password', { privateKey: 'super secret private key' })
console.log(`Created a new wallet named 'my-wallet'.`)
```


## How data is stored

The store is a UTF-8-encoded text file, containing JSON-encoded data.

Each wallet is stored within the JSON-encoded structure. Wallet data is saved as an AES256-XTS-encrypted JSON-encoded string, the key for the AES encryption is derived from the password using PBKDF2.
