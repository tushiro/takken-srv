/**
 * System is unusable.
 * 
 * @type Number
 */

exports.EMERGENCY = 0;

/**
 * Action must be taken immediately.
 * 
 * @type Number 
 */

exports.ALERT = 1;

/**
 * Critical condition.
 *
 * @type Number
 */

exports.CRITICAL = 2;

/**
 * Error condition.
 * 
 * @type Number
 */

exports.ERROR = 3;

/**
 * Warning condition.
 * 
 * @type Number
 */

exports.WARNING = 4;

/**
 * Normal but significant condition.
 * 
 * @type Number
 */

exports.NOTICE = 5;

/**
 * Purely informational message.
 * 
 * @type Number
 */

exports.INFO = 6;

/**
 * Application debug messages.
 * 
 * @type Number
 */

exports.DEBUG = 7;

function Log(level) {
	this.level = level;
}

eventTime = 0, eventIndex = 0;
function getIndex(time) {
	
	if (eventTime < time) {

		eventTime = time;
		eventIndex = 0;
		return eventIndex;
	}

	return eventIndex++;
}

Log.prototype = {
                 
	logging: function(level, message) {
		
		if (level < this.level) {
			return;
		}

		var t = Date.now();
		
		var EventLogDB = require("./event_log_db");
		var EventLog = EventLogDB.EventLog;
		
    	var eventLog = new EventLog(t, level, getIndex(t), message);
    
    	console.log(eventLog);

		var TakkenUtil = require("./takken_util");
		
		try {
			var client = TakkenUtil.getMySQLClient();
		
			client.startTrans();
			
			EventLogDB.insert(client, eventLog);
			
			client.commit();
			
		} catch (e) {
			client.rollback();
			throw e;

		} finally {
			client.end();
		}
	},

	emergency: function(message) {
		this.logging(exports.EMERGENCY, message);
	},

	alert: function(message) {
		this.logging(exports.ALERT, message);
	},

	critical: function(message) {
		this.logging(exports.DEBUG, message);
	},

	error: function(message) {
		this.logging(exports.ERROR, message);
	},

	warning: function(message) {
		this.logging(exports.WARNING, message);
	},

	notice: function(message) {
		this.logging(exports.NOTICE, message);
	},

	info: function(message) {
		this.logging(exports.INFO, message);
	},

	debug: function(message) {
		this.logging(exports.DEBUG, message);
	}
}

module.exports = {
	Log: Log
}
