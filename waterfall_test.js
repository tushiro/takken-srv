
function execute() {

    var async = require('async');
     
    async.waterfall(
      [
        /* first */
        function first(callback) {
          console.log('first function');
          setTimeout(function() {
            console.log('first timeout');
            callback(null, '1st');
          }, 1000);
        },
        /* second */
        function second(str, callback) {
          console.log('second function');
          setTimeout(function() {
            console.log('second timeout');
            callback(null, str + ' 2nd');
          }, 1000);
        },
        /* last */
        function last(str) {
          console.log('last function');
          console.log('str : ' +  str);
        }
      ]
    );
}

module.exports = {
    execute: execute
};
