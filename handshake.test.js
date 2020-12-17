var Buffer = require("buffer/").Buffer;
var forge = require("./forgewrap");
var aBPHPack = require("./handshake");

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
var packEqual = (x, y) => {
    return x.version == y.version && bufferContentsEqual(x.data, y.data);
}

module.exports = [
    function test() {
        var keypair = forge.rsa.genKey(2048);

        var x = new aBPHPack(createTestBuffer().slice(256-11)); // k-11
        var bytes = x.pack(keypair.publicKey);
        var y = aBPHPack.unpack(bytes, keypair.privateKey);

        return packEqual(x,y);
    }
];