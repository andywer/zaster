import test from 'ava'
import path from 'path'
import { storeExists } from '../src'

const fixturesDirPath = path.join(__dirname, '_fixtures')

test('storeExists() works', async t => {
  t.true(await storeExists(path.join(fixturesDirPath, 'sample-store')))
  t.false(await storeExists(path.join(fixturesDirPath, 'does-not-exist')))
})

test.todo('createStore() can create a store')
test.todo('loadStore() can open an existing store')
test.todo('loadOrCreateStore() can create a store')
test.todo('loadOrCreateStore() can open an existing store')
