# Implementation API Specification

Specification for @wallet network implementations.

## Package exports

### getAssets(): Asset[]

Format of `Asset`:

```js
{
  id: string,
  name: string
}
```

Example:

```js
{
  id: 'XBT',
  name: 'Bitcoin'
}
```

**TODO: This is work in progress.**
