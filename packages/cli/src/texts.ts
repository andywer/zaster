import dedent = require('dedent')
import { green, grey } from './formats'

export const walletAdded = (walletId, { testnet }) => dedent`
  ${green(`${testnet ? 'Testnet wallet' : 'Wallet'} added: ${walletId}`)}

  ${grey(dedent`
    Security note:

    The private key has been saved to your local filesystem using a military-grade
    encryption. If you loose your password you will not be able to recover the key!

    Please make sure to store a backup of your private key in a safe place.
  `)}
`
