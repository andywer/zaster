# Project Zaster

Headless multi-blockchain wallet. Build your own blockchain product based on the SDK or use the command line interface to manage your crypto funds.


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
