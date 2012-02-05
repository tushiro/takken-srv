/**
 * @author tushiro
 */
function getMySQLClient() {
  
    var Client = require('mysql').Client;
      
    var client = new Client();
      
    client.user = "DUMMY_DB_USER";
    client.password = "DUMMY_DB_PASSWORD";
    client.host = "DUMMY_DB_HOSTNAME";
    client.database = "DUMMY_DB_NAME";
      
    return client;
}

function getLogger() {
    
//    var log4js = require('log4js')
//
//    log4js.configure({
//        "appenders": [
//            {
//                        type: "console",
//                    category: "console"
//            },
//            {
//                      "type": "file",
//                  "filename": "/home/takken-n/takken.log",
//                "maxLogSize": 1024,
//                   "backups": 10,
//                  "category": "main"
//            }
//        ]
//    });
//
//    var logger = log4js.getLogger("main");
//    logger.setLevel('INFO');

    var Log = require('log');
    var fs = require('fs');
    var stream = fs.createWriteStream('/home/takken-test/file.log', { flags: 'a' })
    var logger = new Log(Log.DEBUG, stream);

    return logger;
}

module.exports = {
    getMySQLClient: getMySQLClient,
    getLogger: getLogger
};
