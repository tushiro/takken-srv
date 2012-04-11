module.exports.toSelectHeader = function toSelectHeader(columns) {
    
    var s = 'SELECT ';
    
    for (var i = 0; i < columns.length; i++) {
        
        var column = columns[i];
        
        if (i > 0) {
            s += ', ';
        }
        
        s += column 
    }
    
    s += 'FROM ';
    
    return s;
}
