var Buffer = require('buffer/').Buffer;
var forge = require("./forgewrap");

const tagLength = 128;
const ivCount = 12;

/**
 * An astrxdBox Pack.
 * @class
 * @property {Number} version The version of the pack.
 * @property {Buffer} data The data contained in a pack.
 */
class aBPack {
    constructor(data, version = 0) {
        this.version = version;
        this.data = data;
    }

    /**
     * Unpacks an aBPack from bytes.
     * @param {Buffer} x Input bytes
     * @param {Buffer} k Key
     * @returns {aBPack} Output object
     */
    static unpack(x, k) {
        var version = x[0];                  // version - 1 byte
        var iv = x.slice(1, 1 + ivCount);    // iv - 12 bytes
        var enc = x.slice(1 + ivCount, -16); // encrypted data - any bytes
        var tag = x.slice(-16);              // tag - 16 bytes

        return new aBPack(forge.aesgcm.decrypt(k, iv, tag, enc), version);
    }

    /**
     * Packs an aBPack into bytes.
     * @param {Buffer} k Key
     * @returns {Buffer} Output bytes
     */
    pack(k) {
        var iv = forge.aesgcm.genIV();

        var { tag, enc } = forge.aesgcm.encrypt(k, iv, this.data);
            
        // Put everything together
        var buf = Buffer.alloc(1 + iv.length + enc.length + tag.length);
        buf.writeUInt8(0, this.version);           // version - 1 byte
        iv.copy(buf, 1);                           // iv - 12 bytes
        enc.copy(buf, 1 + iv.length);              // encrypted data - any bytes
        tag.copy(buf, 1 + iv.length + enc.length); // tag - 16 bytes

        return buf;
    }
}

module.exports = aBPack;