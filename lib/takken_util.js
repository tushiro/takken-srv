/**
 * @author tushiro
 */
function getMySQLClient() {
  
    var Client = require('mysql').Client;

    Client.prototype.startTrans = function (callback) {
        var client = this;
        this.query("SET AUTOCOMMIT = 0", function (err, info) {
        
        	if (err) {
              callback(err);
              return;
            }
    	
        	client.query("START TRANSACTION", function(err, info) {

        		if (err) {
                  callback(err);
                  return;
                }

        		console.log("transaction started.");

        		callback(null, client);
        	});
        });
    };
    
    Client.prototype.commit = function(disconnect, callback) {
    	var client = this;
    	this.query("COMMIT", function (err, info) {

    		if(err) {

    			if (disconnect) {
            		client.end();
            	}
    			
            	callback(err);
                return;
            }       	
        	
            client.query("SET AUTOCOMMIT = 1", function(err, info) {
                
            	if(err) {
                	
            		if (disconnect) {
                		client.end();
                	}

                	callback(err);
                	return;
                }
            
            	console.log("commit completed.");
            	
            	if (disconnect) {
            		client.end();
            	}
            	
            	if (callback == null) {
            		return;
            	}

            	callback(null, client);
            });
    	});
    };
    
    Client.prototype.rollback = function (disconnect, callback) {
    	var client = this;
    	this.query("ROLLBACK", function (err, info) {

    		if(err) {
            	
    			if (disconnect) {
            		client.end();
            	}

            	callback(err);
                return;
            } 
          
        	client.query("SET AUTOCOMMIT = 1", function (err, info) {
     
        		if(err) {

        			if (disconnect) {
                		client.end();
                	}

                    callback(err);
                    return;
                }
            
        		console.log("rollback completed.");

            	if (disconnect) {
            		client.end();
            	}

            	if (callback == null) {
            		return;
            	}

            	callback(null, client);
        	});
    	});
    };
    
    var client = new Client();
      
    
    return client;
}

function getCoreClient() {
    
    var client = getMySQLClient();
    
    client.user = "CDB_USER";
    client.password = "CDB_PWD";
    client.host = "CDB_HOST";
    client.database = "CDB_NAME";
    
    return client;   
}

function getLogger() {
	
	var Log = require("./takken_log").Log;
	
    var logger = new Log(Log.DEBUG);

    return logger;
}

module.exports = {
    getCoreClient: getCoreClient,
    getLogger: getLogger
};
