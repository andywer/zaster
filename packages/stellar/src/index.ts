import { Asset } from '@wallet/implementation-api'

export function getAssets (): Asset[] {
  return [
    {
      id: 'XLM',
      aliases: ['stellar', 'lumens'],
      name: 'Stellar Lumens'
    }
  ]
}
