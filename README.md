# Maitre

## NodeJS Middleware Server

### Synopsis

```bash
maitre [ --port=<PORT_NUMBER> ]
```

### Description

Maitre serves an HTTP request by importing a service (as ECMAScript Module) from the following path:

```js
process .cwd () + request .url .pathname + request .method + '.js'
```

To control how the HTTP response is written,
export the following from the Service module:

#### `statusCode`

A 3-digit number representing the status code of the response.

##### Example

```js
export const statusCode = 200;
```

#### `statusMessage`

A string representing the status message of the response.

##### Example

```js
export const statusMessage = 'Connection Established';
```

#### `headers`

An object (dictionary) of name/value pairs, where each pair represents a header of the response.

##### Example

```js
export const headers = {

  'content-type': 'text/plain',
  'connection': 'keep-alive',
  'host': 'example.com',
  'accept': '*/*'

};
```

#### `encoding`

A string representing the encoding of the response body.

##### Example

```js
export const encoding = 'utf8';
```

#### `body`

A string or Buffer representing the response body.

##### Example

```js
export const body = 'Hello World! This is Maitre!';
```

#### Or, for Dynamic Serving

Export a function as the default Export;
returning an object containing the same properties described abov.

##### Example

```js
export default request => ( {

  statusCode: 404,
  statusMessage: 'Not Found',
  headers: {
    'Content-Type': 'text/plain'
  },
  encoding: 'utf8',
  body: `I don't have a way to serve you at this location ${ request .url }`

} );
```

### Install Maitre

```bash
sudo npm i -g maitre
```
