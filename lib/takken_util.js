/**
 * @author tushiro
 */
function getMySQLClient() {
  
    var Client = require('mysql').Client;

    Client.prototype.startTrans = function() {
      var client = this;
      this.query("SET AUTOCOMMIT = 0", function(err, info) {
        if(err) {
          throw err;
        } else {
          client.query("START TRANSACTION", function(err, info) {
            if(err) {
              throw err;
            }
          });
        }
      });
    };
    
    Client.prototype.commit = function() {
      var client = this;
      this.query("COMMIT", function(err, info) {
        if(err) {
            throw err;
        } else {
          client.query("SET AUTOCOMMIT = 1", function(err, info) {
            if(err) {
            	throw err;
            } 
          });
        }
      });
    };
    
    Client.prototype.rollback = function() {
      var client = this;
      this.query("ROLLBACK", function(err, info) {
        if(err) {
            throw err;
        } else {
          client.query("SET AUTOCOMMIT = 1", function(err, info) {
            if(err) {
                throw err;
            }
          });
        }
      });
    };
    
    var client = new Client();
      
    client.user = "CST_DB_USER";
    client.password = "CST_DB_PWD";
    client.host = "CST_DB_HOST";
    client.database = "CST_DB_NAME";
    
    return client;
}

function getLogger() {
	
	var Log = require("./takken_log").Log;
	
    var logger = new Log(Log.DEBUG);

    return logger;
}

module.exports = {
    getMySQLClient: getMySQLClient,
    getLogger: getLogger
};
