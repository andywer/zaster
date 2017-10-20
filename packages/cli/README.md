# @wallet CLI

Digital payment, as simple as Git. CLI tool of the @wallet library.

## Usage

```
# Features in Step I

$ wallet add <walletId> --asset <asset> --private-key <key> [--testnet]
$ wallet create <walletId> --asset <asset> [--testnet]
$ wallet ls
$ wallet rm <walletID>

$ wallet assets

$ wallet log <walletID> [--from-date <date>] [--to-date <date>]

$ wallet show <walletID>
$ wallet show transaction <asset>/<txID>

$ wallet pay [<walletID>] -i|--interactive
$ wallet pay <walletID> -d|--destination <address> -a|--amount <amount> -m|--memo <description>

$ wallet destroy --mergeInto <address>

$ wallet stellar-create <walletId> <address> -a|--amount <amount>


# Features in Step II

$ wallet topup coinbase.com|<someProvider> -i|--interactive
$ wallet withdraw coinbase.com|<someProvider> -i|--interactive

# a non-interactive mode would be cool, but not sure if its easily feasable


# Features in Step III

$ wallet stellar-trustline ls <walletID>
$ wallet stellar-trustline add <walletID> <trustline>
$ wallet stellar-trustline rm <walletID> <trustline>
```


## Possible future features

* Securely sync private keys across machines
* Two-factor-authentication


## Additional considerations

Keep in mind that

* a network/coin might support different types of tokens
