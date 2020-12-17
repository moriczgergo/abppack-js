var Buffer = require("buffer/").Buffer;
var forge = require("./forgewrap");
var aBPPack = require("./pack");

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
        var key = forge.aesgcm.genKey();

        var x = new aBPPack(createTestBuffer());
        var bytes = x.pack(key);
        var y = aBPPack.unpack(bytes, key);

        return packEqual(x,y);
    }
];