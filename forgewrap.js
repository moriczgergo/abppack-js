// Library for forge and Buffer compatibility.
var Buffer = require('buffer/').Buffer;
var forge = require("node-forge");

/**
 * Result of an AES Encryption operation
 * @class
 * @property {Buffer} enc Encrypted data
 * @property {Buffer} tag Authentication tag
 */
class AESGCMEncryptionResult {
    constructor(enc, tag) {
        this.enc = enc;
        this.tag = tag;
    }
}

/**
 * Converts Forge Buffer into Buffer.
 * @param {forge.util.ByteStringBuffer} x Input
 * @returns {Buffer} Output
 */
function fb2b(x) {
    return Buffer.from(x.toHex(), "hex");
}

/**
 * Converts Forge String into Buffer.
 * @param {string} x Input
 * @returns {Buffer} Output
 */
function fs2b(x) {
    return Buffer.from(fs2fb(x).toHex(), "hex");
}

/**
 * Converts Forge String into Forge Buffer.
 * @param {string} x Input
 * @returns {forge.util.ByteStringBuffer} Output
 */
function fs2fb(x) {
    return forge.util.createBuffer(x);
}

/**
 * Converts Forge Buffer into Forge String.
 * @param {forge.util.ByteStringBuffer} x Input
 * @returns {string} Output
 */
function fb2fs(x) {
    return x.bytes();
}

/**
 * Converts Buffer into Forge Buffer
 * @param {Buffer} x Input
 * @returns {forge.util.ByteStringBuffer} Output
 */
function b2fb(x) {
    return forge.util.createBuffer(x);
}

/**
 * Converts Buffer into Forge String
 * @param {Buffer} x Input
 * @returns {forge.util.ByteStringBuffer} Output
 */
function b2fs(x) {
    return b2fb(x).bytes();
}

/**
 * Encrypts data with RSA.
 * Maximum plaintext length is (k.n.toString(2).length / 8) - 11
 * @param {forge.pki.rsa.PublicKey} k Public key
 * @param {Buffer} x Plaintext
 * @returns {Buffer} Ciphertext
 */
function rsaEncrypt(k, x) {
    return fs2b(k.encrypt(b2fs(x)));
}

/**
 * Generates RSA keypair.
 * @param {number} b Bits
 * @param {number} e Exponent
 * @returns {forge.pki.rsa.KeyPair} Keypair
 */
function rsaGenKey(b = 2048, e = 0x10001) {
    return forge.pki.rsa.generateKeyPair({bits: b, e});
}

/**
 * Decrypts data with RSA.
 * Maximum plaintext length is (k.n.toString(2).length / 8) - 11
 * @param {forge.pki.rsa.PrivateKey} k Private key
 * @param {Buffer} x Ciphertext
 * @returns {Buffer} Plaintext
 */
function rsaDecrypt(k, x) {
    return fs2b(k.decrypt(b2fs(x)));
}

/**
 * Generates an IV for use with AES-GCM.
 * @param {number} [l=12] IV length in bytes
 * @returns {Buffer} IV
 */
function aesGenIV(l = 12) {
    return fs2b(forge.random.getBytesSync(l));
}

/**
 * Generates a key for use with AES-GCM.
 * @param {number} [l=32] Key length in bytes
 * @returns {Buffer} Key
 */
function aesGenKey(l = 32) {
    return fs2b(forge.random.getBytesSync(l));
}

/**
 * Encrypts data with AES-GCM.
 * @param {Buffer} k Key
 * @param {Buffer} iv IV
 * @param {Buffer} x Plaintext
 * @param {number} [tagLength=128] Tag length in bits
 * @returns {AESGCMEncryptionResult} Ciphertext and Authentication Tag
 */
function aesEncrypt(k, iv, x, tagLength = 128) {
    var cipher = forge.cipher.createCipher("AES-GCM", b2fb(k));
    cipher.start({
        iv: b2fb(iv),
        tagLength
    });
    cipher.update(b2fb(x));
    cipher.finish();

    return new AESGCMEncryptionResult(fb2b(cipher.output), fb2b(cipher.mode.tag));
}

/**
 * Decrypts data with AES-GCM.
 * @param {Buffer} k Key
 * @param {Buffer} iv IV
 * @param {Buffer} tag Authentication Tag
 * @param {Buffer} x Ciphertext
 * @param {number} [tagLength=128]
 * @returns {Buffer|null} Plaintext or null if authentication is invalid
 */
function aesDecrypt(k, iv, tag, x, tagLength = 128) {
    var cipher = forge.cipher.createDecipher("AES-GCM", b2fb(k));
    cipher.start({
        iv: b2fb(iv),
        tag: b2fb(tag),
        tagLength
    });
    cipher.update(b2fb(x));
    var pass = cipher.finish();

    if (pass) return fb2b(cipher.output);
    else return null;
}

module.exports = {
    util: {
        fb2b,
        fs2b,
        fs2fb,
        fb2fs,
        b2fb,
        b2fs,
    },
    rsa: {
        genKey: rsaGenKey,
        encrypt: rsaEncrypt,
        decrypt: rsaDecrypt
    },
    aesgcm: {
        AESGCMEncryptionResult: AESGCMEncryptionResult,
        genIV: aesGenIV,
        genKey: aesGenKey,
        encrypt: aesEncrypt,
        decrypt: aesDecrypt
    }
}