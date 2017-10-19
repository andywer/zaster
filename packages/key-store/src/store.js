import { createCipher, createDecipher, pbkdf2Sync, randomBytes } from 'crypto'

export function createStore ({ saveFile, wallets = {} }) {
  return {
    getWalletIDs () {
      return Object.keys(wallets)
    },
    async save () {
      await saveFile(stringifyStore({ wallets }))
    },
    async saveWallet (walletId, password, walletData) {
      const salt = walletId in wallets ? wallets[walletId].salt : (await createRandomBuffer(8)).toString('hex')
      const data = encryptWalletData(JSON.stringify(walletData), password, salt)
      wallets[walletId] = { data, salt }
      await saveFile(stringifyStore({ wallets }))
    },
    async readWallet (walletId, password) {
      const { data, salt } = wallets[walletId]
      return JSON.parse(decryptWalletData(data, password, salt))
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

function encryptWalletData (stringData, password, salt) {
  const key = deriveKeyFromPassword(password, salt)
  const cipher = createCipher('aes-256-xts', key)
  const encrypted = cipher.update(stringData, 'utf8', 'base64') + cipher.final('base64')
  return encrypted
}

function decryptWalletData (base64Data, password, salt) {
  const key = deriveKeyFromPassword(password, salt)
  const decipher = createDecipher('aes-256-xts', key)
  const decrypted = decipher.update(base64Data, 'base64', 'utf8') + decipher.final('utf8')
  return decrypted
}

function deriveKeyFromPassword (password, salt) {
  return pbkdf2Sync(password, Buffer.from(salt, 'hex'), 20000, 256, 'sha256').toString('base64')
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
