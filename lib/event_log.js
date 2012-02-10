
var EventLog = function EventLog(time, level, text) {
	this.time = time;
	this.level = level;
	this.text = text;
}

module.exports = {
    EventLog: EventLog              
};