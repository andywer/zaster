import test from 'ava'
import fs from 'mz/fs'
import path from 'path'
import temp from 'temp'
import { createStore, loadStore, loadOrCreateStore, storeExists } from '../src'

temp.track()

const fixturesDirPath = path.join(__dirname, '_fixtures')

test('storeExists() works', async t => {
  t.true(await storeExists(path.join(fixturesDirPath, 'sample-store')))
  t.false(await storeExists(path.join(fixturesDirPath, 'does-not-exist')))
})

test('createStore() can create a store', async t => {
  const filePath = temp.path()
  const store = await createStore(filePath)

  t.is(typeof store, 'object')
  t.is(typeof store.getWalletIDs, 'function')
  t.deepEqual(await store.getWalletIDs(), [])
})

test('loadStore() can open an existing store', async t => {
  const store = await loadStore(path.join(fixturesDirPath, 'sample-store'))

  t.is(typeof store, 'object')
  t.is(typeof store.getWalletIDs, 'function')
  t.deepEqual(await store.getWalletIDs(), [])
})

test('loadOrCreateStore() can create a store', async t => {
  const filePath = temp.path()
  const store = await loadOrCreateStore(filePath)

  t.is(typeof store, 'object')
  t.is(typeof store.getWalletIDs, 'function')
  t.deepEqual(await store.getWalletIDs(), [])
  t.true((await fs.stat(filePath)).isFile())
})

test('loadOrCreateStore() can open an existing store', async t => {
  const store = await loadOrCreateStore(path.join(fixturesDirPath, 'sample-store'))

  t.is(typeof store, 'object')
  t.is(typeof store.getWalletIDs, 'function')
  t.deepEqual(await store.getWalletIDs(), [])
})
