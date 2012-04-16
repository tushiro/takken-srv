module.exports.toSelectHeader = function toSelectHeader(tableName, columns) {
    
    var s = 'SELECT ';
    
    for (var i = 0; i < columns.length; i++) {
        
        var column = columns[i];
        
        if (i > 0) {
            s += ', ';
        }
        
        s += column 
    }
    
    s += 'FROM ' + tableName;
    
    return s;
}

module.exports.toUpdateHeader = function toUpdateHeader(tableName) {
    return 'UPDATE ' + tableName + ' SET';
}

module.exports.toInsertSql = function toInsertSql(tableName, columns) {
    
    var header = 'INSERT INTO ' + tableName + ' (';
    var values = 'VALUES (';
    
    for (var i = 0; i < columns.length; i++) {
        
        var column = columns[i];
        
        if (i > 0) {
            header += ', ';
            values += ', ';
        }
        
        header += column
        values += '?'; 
    }
    
    var sql = header + ') ' + values + ')'
    
    return sql;
}
