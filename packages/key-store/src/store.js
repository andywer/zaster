import { createCipher, createDecipher, pbkdf2Sync, randomBytes } from 'crypto'

export function createStore ({ saveFile, wallets = {} }) {
  return {
    getWalletIDs () {
      return Object.keys(wallets)
    },
    async save () {
      await saveFile(stringifyStore({ wallets }))
    },
    async saveWallet (walletId, password, walletData, keyMeta = null) {
      if (!keyMeta) {
        keyMeta = walletId in wallets ? wallets[walletId].keyMeta : await createKeyMetadata()
      }
      const data = encryptWalletData(JSON.stringify(walletData), password, keyMeta)
      wallets[walletId] = { data, keyMeta }
      await saveFile(stringifyStore({ wallets }))
    },
    async readWallet (walletId, password) {
      const { data, keyMeta } = wallets[walletId]
      return JSON.parse(decryptWalletData(data, password, keyMeta))
    },
    async removeWallet (walletId) {
      if (!(walletId in wallets)) {
        throw new Error(`Wallet ${walletId} not found in store.`)
      }
      delete wallets[walletId]
      await saveFile(stringifyStore({ wallets }))
    }
  }
}

function encryptWalletData (stringData, password, keyMeta) {
  const key = deriveKeyFromPassword(password, keyMeta)
  const cipher = createCipher('aes-256-xts', key)
  const encrypted = cipher.update(stringData, 'utf8', 'base64') + cipher.final('base64')
  return encrypted
}

function decryptWalletData (base64Data, password, keyMeta) {
  const key = deriveKeyFromPassword(password, keyMeta)
  const decipher = createDecipher('aes-256-xts', key)
  const decrypted = decipher.update(base64Data, 'base64', 'utf8') + decipher.final('utf8')
  return decrypted
}

function deriveKeyFromPassword (password, { hash, iterations, salt }) {
  return pbkdf2Sync(password, Buffer.from(salt, 'hex'), iterations, 256, hash).toString('base64')
}

async function createKeyMetadata () {
  const buffer = await createRandomBuffer(8)
  return {
    hash: 'sha256',
    iterations: 20000,
    salt: buffer.toString('hex')
  }
}

async function createRandomBuffer (sizeInBytes) {
  return new Promise((resolve, reject) => {
    randomBytes(sizeInBytes, (error, buffer) => error ? reject(error) : resolve(buffer))
  })
}

function stringifyStore ({ wallets }) {
  return JSON.stringify({
    version: 1,
    wallets
  })
}
