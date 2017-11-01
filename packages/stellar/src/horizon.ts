import { Network, Server } from 'stellar-sdk'

let pubnetHorizon: Server = null
let testnetHorizon: Server = null

export function getHorizonServer ({ testnet }: { testnet: boolean }): Server {
  if (testnet) {
    if (!testnetHorizon) {
      testnetHorizon = new Server('https://horizon-testnet.stellar.org/')
    }
    return testnetHorizon
  } else {
    if (!pubnetHorizon) {
      pubnetHorizon = new Server('https://horizon.stellar.org/')
    }
    return pubnetHorizon
  }
}

export function useNetwork ({ testnet }: { testnet: boolean }) {
  if (testnet) {
    Network.useTestNetwork()
  } else {
    Network.usePublicNetwork()
  }
}
