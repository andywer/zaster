# Zaster CLI

Digital payment, as simple as Git. CLI tool of project Zaster.

**Attention: The private keys are stored in a truly secure way (AES-256 encryption). If you loose your password you will not be able to recover the keys! So please make sure to store a backup of your private keys in a safe place.**


## Usage

```
# Features in Step I

$ zaster add <walletId> --asset <asset> --private-key <key> [--testnet]
$ zaster create <walletId> --asset <asset> [--testnet]
$ zaster ls
$ zaster rm <walletID>
$ zaster backup <walletID>

$ zaster assets

$ zaster show balance <walletID>
$ zaster show balance <asset>:<address> [--testnet]
$ zaster show transaction <walletID>:<txID>
$ zaster show transaction <asset>:<txID>

$ zaster address <walletID>
$ zaster pay <walletID> -d|--destination <address> -a|--amount <amount> -m|--memo <description>

$ zaster log <walletID> [--from-date <date>] [--to-date <date>] [--limit <maxCount>]


# Features in Step II

$ zaster stellar-activate <walletId> <address> -a|--amount <amount>

$ zaster show rate <asset|fiat>/<asset|fiat> [--provider <provider>] [--live]


# Features in Step III

$ zaster topup <walletID> coinbase.com|<someProvider>
$ zaster withdraw <walletID> coinbase.com|<someProvider>

# a non-interactive mode would be cool, but not sure if its easily feasable


# Features in Step IV

$ zaster stellar-trustline ls <walletID>
$ zaster stellar-trustline add <walletID> <trustline>
$ zaster stellar-trustline rm <walletID> <trustline>
```


## Possible future features

* Securely sync private keys across machines
* Two-factor-authentication
* HTTP/SMTP-like transaction notation standard?


## Additional considerations

Keep in mind that

* a network/coin might support different types of tokens


## Environment variables

* `WALLET_STORE_PATH` - Path to key store file. Defaults to `~/.wallets`.
