/**
 * @author tushiro
 */
function getMySQLClient() {
  
    var Client = require('mysql').Client;

    Client.prototype.startTrans = function(callback) {
      var client = this;
      this.query("SET AUTOCOMMIT = 0", function(err, info) {
        if(err) {
          callback(err);
        } else {
          client.query("START TRANSACTION", function(err, info) {
            if(err) {
              callback(err);
            } else {
              callback(null, info);
            }
          });
        }
      });
    };
    
    Client.prototype.commit = function(callback) {
      var client = this;
      this.query("COMMIT", function(err, info) {
        if(err) {
          callback(err);
        } else {
          client.query("SET AUTOCOMMIT = 1", function(err, info) {
            if(err) {
              callback(err);
            } else {
              callback(null, info);
            } 
          });
        }
      });
    };
    
    Client.prototype.rollback = function(callback) {
      var client = this;
      this.query("ROLLBACK", function(err, info) {
        if(err) {
          callback(err);
        } else {
          client.query("SET AUTOCOMMIT = 1", function(err, info) {
            if(err) {
              callback(err);
            } else {
              callback(null, info);
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
	
	var takkenLog = require("./takken_log");
	
	var Log = takkenLog.Log;
	
    var logger = new Log(Log.DEBUG);

    return logger;
}

module.exports = {
    getMySQLClient: getMySQLClient,
    getLogger: getLogger
};
