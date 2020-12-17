var forge = require("./forgewrap");
var Buffer = require("buffer/").Buffer;

var createTestBuffer = () => Buffer.from(new Array(256).fill(0).map((x,i) => i));
var bufferContentsEqual = (x, y) => {
    if (!Buffer.isBuffer(x) || !Buffer.isBuffer(y)) return false;

    var ax = [...x], ay = [...y];

    if (ax.length != ay.length) return false;
    for (var i = 0; i < ax.length; i++) {
        if (ax[i] != ay[i]) return false;
    }

    return true;
};

module.exports = [
    function convertChain() {
        var x = createTestBuffer();

        var y = createTestBuffer();
        y = forge.util.b2fs(y);
        y = forge.util.fs2fb(y);
        y = forge.util.fb2b(y);
        y = forge.util.b2fb(y);
        y = forge.util.fb2fs(y);
        y = forge.util.fs2b(y);

        return bufferContentsEqual(x,y);
    },
    function rsaTest() {
        var keypair = forge.rsa.genKey(2048);
    
        var x = createTestBuffer().slice(0, 256-11); // k-11

        var enc = forge.rsa.encrypt(keypair.publicKey, x);
        var y = forge.rsa.decrypt(keypair.privateKey, enc);

        return bufferContentsEqual(x,y);
    },
    function aesTest() {
        var key = forge.aesgcm.genKey();
        var iv = forge.aesgcm.genKey();
        
        var x = createTestBuffer();
        
        var { enc, tag } = forge.aesgcm.encrypt(key, iv, x);
        var y = forge.aesgcm.decrypt(key, iv, tag, enc);

        return bufferContentsEqual(x, y);
    }
];