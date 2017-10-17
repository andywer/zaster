export function createStore ({ saveFile, wallets = {} }) {
  return {
    getWalletIDs () {
      return Object.keys(wallets)
    },
    async save () {
      await saveFile(stringifyStore({ wallets }))
    }
  }
}

function stringifyStore ({ wallets }) {
  return JSON.stringify({
    version: 1,
    wallets
  })
}
