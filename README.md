# Project Zaster
[![Build Status](https://travis-ci.org/andywer/zaster.svg?branch=master)](https://travis-ci.org/andywer/key-store)
[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

The headless multi-blockchain wallet.

* 💸 Manage your crypto funds
* 🤖 Automate payments using the [command line tool](./packages/cli)
* 🛠 Build your own blockchain product using the [SDK](./packages/sdk)
* 📲 Easy machine-to-machine payments
* 🔐 No lock-in: Will support Bitcoin, Ethereum, Stellar, ...

<h4 align="center">
  ⚠️ <b>Under construction</b> ⚠️
</h4>


## Definition

<h3>zaster</h3>
<h4><i>noun, no plural</i> | zas·ter | [ˈtsastɐ]</h4>

<ol>
  <li>German term for <b>money</b>. Informal.</li>
</ol>

Synonyms:

<ol>
  <li>bucks</li>
  <li>cash</li>
  <li>dough</li>
  <li>loot</li>
  <li>money</li>
</ol>


## How to use

Check out the [**CLI tool**](./packages/cli) to make blockchain transactions and manage wallets/keys using the command line.

Building your own product? Check out [**the SDK**](./packages/sdk) to create advanced applications and services using a blockchain of your choice.


## Road Map

### Supported Platforms

- [x] [Stellar](https://stellar.org/)
- [ ] Bitcoin
- [ ] Ethereum
- [ ] IOTA

### Supported CLI functionality

- [x] Create and manage wallets
- [x] Get addresses and balances
- [x] Send payment transactions
- [ ] Show transaction history
- [ ] Show fiat equivalents
- [ ] Advanced transaction features, like memos
- [ ] Multi signature wallets
- [ ] Send payments to email addresses


## Architecture

```
                                                CLI

                                                ||
                                                \/

                          +-------------------------------------------------+
                          |                     SDK                         |
                          +-------------------------------------------------+
                          |                                                 |
                          |   Platform A      Platform B       Platform C   |
                          |   (eg. Bitcoin)   (eg. Ethereum)   (...)        |
                          +-------------------------------------------------+
```


## License

MIT
