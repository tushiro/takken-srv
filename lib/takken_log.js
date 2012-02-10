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

	eventTime = time;
	return eventIndex++;
}

Log.prototype = {
                 
	logging: function(level, message) {
		
		if (level < this.level) {
			return;
		}

		var TakkenUtil = require("./takken_util");
		var EventLogDB = require("./event_log_db");
		var EventLog = EventLogDB.EventLog;
		
		try {
			var client = TakkenUtil.getMySQLClient();
		
			client.startTrans();
			
			var eventLog = new EventLog(Date.now(), level, message);

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
		this.logging(exports.EMERGENCY, arguments);
	},

	alert: function(message) {
		this.logging(exports.ALERT, arguments);
	},

	critical: function(message) {
		this.logging(exports.DEBUG, arguments);
	},

	error: function(message) {
		this.logging(exports.ERROR, arguments);
	},

	warning: function(message) {
		this.logging(exports.WARNING, arguments);
	},

	notice: function(message) {
		this.logging(exports.NOTICE, arguments);
	},

	info: function(message) {
		this.logging(exports.INFO, arguments);
	},

	debug: function(message) {
		this.logging(exports.DEBUG, arguments);
	}
}

module.exports = {
	Log: Log
}
