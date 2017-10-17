import fs from 'mz/fs'
import { createStore } from './store'

async function storeFileExists (filePath) {
  try {
    const stat = await fs.stat(filePath)
    return stat.isFile()
  } catch (error) {
    return false
  }
}

async function createStoreFile (filePath) {
  const saveToDisk = async fileContent => {
    await fs.writeFile(filePath, fileContent, { encoding: 'utf-8', flag: 'wx' })
  }
  const store = createStore({ saveToDisk })
  await store.save()
  return store
}

export {
  createStoreFile as createStore,
  storeFileExists as storeExists
}
