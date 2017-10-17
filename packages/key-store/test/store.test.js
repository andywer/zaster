import test from 'ava'
import fs from 'mz/fs'
import path from 'path'
import temp from 'temp'
import { createStore, loadStore } from '../src'

temp.track()

test('store.saveWallet() can save a new wallet', async t => {
  const filePath = temp.path()
  const store = await createStore(filePath)

  await store.saveWallet('walletID', 'somePassword', { privateKey: 'secretPrivateKey' })

  t.deepEqual(store.getWalletIDs(), ['walletID'])
  t.deepEqual(store.readWallet('walletID', 'somePassword'), { privateKey: 'secretPrivateKey' })

  const reloadedStore = await loadStore(filePath)

  t.deepEqual(reloadedStore.getWalletIDs(), ['walletID'])
  t.deepEqual(reloadedStore.readWallet('walletID', 'somePassword'), { privateKey: 'secretPrivateKey' })
})

test.todo('store.saveWallet() can update an existing wallet')
test.todo('store.getWalletIDs() returns all wallet IDs')
test.todo('store.readWallet() can decrypt and decode a wallet')
test.todo('store.readWallet() throws proper error on wrong password')
test.todo('store.removeWallet() can delete a wallet from the store')
