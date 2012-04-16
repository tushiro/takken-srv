
var sjcl = require('sjcl');

module.exports.CODE = process.env.SECURE_CODE; 

module.exports.decode = function (text) {
    return sjcl.decrypt(CODE, text);
}

module.exports.encode = function (text) {
    return sjcl.encrypt(CODE, text);
}
