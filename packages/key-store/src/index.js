import fs from 'mz/fs'

export async function storeExists (filePath) {
  try {
    const stat = await fs.stat(filePath)
    return stat.isFile()
  } catch (error) {
    return false
  }
}
