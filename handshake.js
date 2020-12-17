var Buffer = require('buffer/').Buffer;
var forge = require("./forgewrap");

/**
 * An astrxdBox Protocol HandshakePack.
 * @class
 * @property {Number} version - The version of the pack.
 * @property {Buffer} data - The data contained in a pack.
 */
class aBPHPack {
    /**
     * Creates an aBPHPack
     * @param {Buffer} data Data
     * @param {number} [version=0] Pack version
     */
    constructor(data, version = 0) {
        this.version = version;
        this.data = data;
    }

    /**
     * Unpacks an aBPHPack from bytes.
     * @param {Buffer} x Input bytes
     * @param {rsa.PrivateKey} k Private key
     * @returns {aBPHPack} Output object
     */
    static unpack(x, k) {
        // Decrypt data with key
        var dx = forge.rsa.decrypt(k, x.slice(1));
        
        return new aBPHPack(dx, x.readUInt8(0));
    }

    /**
     * Packs an aBPHPack into bytes.
     * @param {rsa.PublicKey} k Public key
     * @returns {Buffer} Output bytes
     */
    pack(k) {
        var ex = forge.rsa.encrypt(k, this.data);

        var buf = Buffer.alloc(1 + ex.length);
        buf.writeUInt8(this.version, 0);
        ex.copy(buf, 1, 0, ex.length);

        return buf;
    }
}

module.exports = aBPHPack;