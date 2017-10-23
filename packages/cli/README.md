# @wallet CLI

Digital payment, as simple as Git. CLI tool of the @wallet library.

## Usage

```
# Features in Step I

$ wallet add <walletId> --asset <asset> --private-key <key> [--testnet]
$ wallet create <walletId> --asset <asset> [--testnet]
$ wallet ls
$ wallet rm <walletID>
$ wallet backup <walletID>

$ wallet assets

$ wallet show balance <walletID>
$ wallet show balance <asset>:<address>
$ wallet show transaction <asset>:<txID>

$ wallet pay <walletID> -d|--destination <address> -a|--amount <amount> -m|--memo <description>

$ wallet destroy --mergeInto <address>

$ wallet stellar-create <walletId> <address> -a|--amount <amount>

$ wallet log <walletID> [--from-date <date>] [--to-date <date>]


# Features in Step II

$ wallet show rate <asset|fiat>/<asset|fiat> [--provider <provider>] [--live]


# Features in Step III

$ wallet topup <walletID> coinbase.com|<someProvider>
$ wallet withdraw <walletID> coinbase.com|<someProvider>

# a non-interactive mode would be cool, but not sure if its easily feasable


# Features in Step IV

$ wallet stellar-trustline ls <walletID>
$ wallet stellar-trustline add <walletID> <trustline>
$ wallet stellar-trustline rm <walletID> <trustline>
```


## Possible future features

* Securely sync private keys across machines
* Two-factor-authentication
* HTTP/SMTP-like transaction notation standard?


## Additional considerations

Keep in mind that

* a network/coin might support different types of tokens
