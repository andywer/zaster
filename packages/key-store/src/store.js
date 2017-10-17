export function createStore ({ saveToDisk, wallets = {} }) {
  return {
    getWalletIDs () {
      return Object.keys(wallets)
    },
    async save () {
      await saveToDisk(stringifyStore({ wallets }))
    }
  }
}

function stringifyStore ({ wallets }) {
  return JSON.stringify({
    version: 1,
    wallets
  })
}
