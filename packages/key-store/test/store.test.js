import test from 'ava'
import fs from 'mz/fs'
import path from 'path'
import temp from 'temp'
import { createStore, loadStore } from '../src'

temp.track()

test.todo('store.getWalletIDs() returns all wallet IDs')
test.todo('store.readWallet() can decrypt and decode a wallet')
test.todo('store.readWallet() throws proper error on wrong password')

test('store.saveWallet() can save a new wallet', async t => {
  const filePath = temp.path()
  const store = await createStore(filePath)

  await store.saveWallet('walletID', 'somePassword', { privateKey: 'secretPrivateKey' })

  t.deepEqual(store.getWalletIDs(), ['walletID'])
  t.deepEqual(await store.readWallet('walletID', 'somePassword'), { privateKey: 'secretPrivateKey' })

  const reloadedStore = await loadStore(filePath)

  t.deepEqual(reloadedStore.getWalletIDs(), ['walletID'])
  t.deepEqual(await reloadedStore.readWallet('walletID', 'somePassword'), { privateKey: 'secretPrivateKey' })
})

test('store.saveWallet() can update an existing wallet', async t => {
  const filePath = temp.path()
  const store = await createStore(filePath)

  await store.saveWallet('walletID', 'somePassword', { privateKey: 'secretPrivateKey' })
  await store.saveWallet('walletID', 'somePassword', { privateKey: 'newPrivateKey' })

  t.deepEqual(await store.readWallet('walletID', 'somePassword'), { privateKey: 'newPrivateKey' })

  let reloadedStore = await loadStore(filePath)
  t.deepEqual(await reloadedStore.readWallet('walletID', 'somePassword'), { privateKey: 'newPrivateKey' })

  await store.saveWallet('walletID', 'newPassword', { privateKey: 'newPrivateKey' })
  t.deepEqual(await store.readWallet('walletID', 'newPassword'), { privateKey: 'newPrivateKey' })

  reloadedStore = await loadStore(filePath)
  t.deepEqual(await reloadedStore.readWallet('walletID', 'newPassword'), { privateKey: 'newPrivateKey' })
})

test('store.removeWallet() can delete a wallet from the store', async t => {
  const filePath = temp.path()
  const store = await createStore(filePath)

  await store.saveWallet('walletID', 'somePassword', { privateKey: 'secretPrivateKey' })
  t.deepEqual(store.getWalletIDs(), ['walletID'])

  await store.removeWallet('walletID')
  t.deepEqual(store.getWalletIDs(), [])

  const reloadedStore = await loadStore(filePath)
  t.deepEqual(reloadedStore.getWalletIDs(), [])
})
