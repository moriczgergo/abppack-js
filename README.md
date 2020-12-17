# ABPPack.js
ABPPack JavaScript implementation.

## Install
```
npm install --save @astrxd/abppack
```

## Test
```
git clone https://github.com/astrxd443/abppack-js
cd abppack-js
npm install

# or, if module is already installed:

cd node_modules/@astrxd/abppack

# then:

npm run test
```

## Usage
```js
var {aBPPack, aBPHPack, forge} = require("@astrxd/abppack");

var testBuffer = Buffer.from("Hello World!", "utf8"); // Test buffer for test message

// aBPHPack
forge.rsa.genKeyAsync().then(rsaKeypair => { // Generate RSA keypair
    var hPack = new aBPHPack(testBuffer); // Create a Handshake Pack
    var hBytes = hPack.pack(rsaKeypair.publicKey); // Encrypt & Assemble a Handshake Pack
    var hPack2 = aBPHPack.unpack(hBytes, rsaKeypair.privateKey); // Take apart & Decrypt a Handshake Pack
    console.log("aBPHPack:", hPack2.data.toString("utf8")); // "Hello World!"
}); 

// aBPPack
var aesKey = forge.aesgcm.genKey(); // Generate AES key
var pack = new aBPPack(testBuffer); // Create a Pack
var bytes = pack.pack(aesKey); // Encrypt & Assemble a Pack
var pack2 = aBPPack.unpack(bytes, aesKey); // Take apart & Decrypt a Pack
console.log("aBPPack:", pack2.data.toString("utf8")); // "Hello World!"
```