import input from 'input'
import { newInputError } from './errors'

export async function readPassword ({ repeat = false } = {}) {
  const password = await input.password(`Password: `)

  if (repeat) {
    const repeatedPassword = await input.password(`Repeat password: `)
    if (repeatedPassword !== password) throw newInputError(`Passwords do not match.`)
  }

  return password
}
