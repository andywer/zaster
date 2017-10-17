import test from 'ava'
import path from 'path'
import temp from 'temp'
import { createStore, storeExists } from '../src'

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

test.todo('loadStore() can open an existing store')
test.todo('loadOrCreateStore() can create a store')
test.todo('loadOrCreateStore() can open an existing store')
