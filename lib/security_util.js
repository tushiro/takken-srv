
var sjcl = require('sjcl');

module.exports.SOUL_WORD = 'F333ortune777'; 

module.exports.decode = function (text) {
    return sjcl.decrypt(SOUL_WORD, text);
}

module.exports.encode = function (text) {
    return sjcl.encrypt(SOUL_WORD, text);
}
