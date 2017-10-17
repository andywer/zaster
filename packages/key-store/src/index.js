import fs from 'mz/fs'
import { createStore } from './store'

const save = filePath => async fileContent => {
  await fs.writeFile(filePath, fileContent, { encoding: 'utf-8', flag: 'wx' })
}

async function storeFileExists (filePath) {
  try {
    const stat = await fs.stat(filePath)
    return stat.isFile()
  } catch (error) {
    return false
  }
}

async function createStoreFile (filePath) {
  const store = createStore({ saveFile: save(filePath) })
  await store.save()
  return store
}

async function loadStoreFile (filePath) {
  const parsedFileContent = JSON.parse(await fs.readFile(filePath))
  const { wallets } = parsedFileContent
  return createStore({ saveFile: save(filePath), wallets })
}

export {
  createStoreFile as createStore,
  loadStoreFile as loadStore,
  storeFileExists as storeExists
}
