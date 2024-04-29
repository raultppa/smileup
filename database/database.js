const mysql = require('mysql2/promise');
const dbconfig = require('./dbconfig.js');

class Database{

	constructor(){
		this.pool = mysql.createPool(dbconfig);
	}

	async query(sql, values) {
	    const [rows, fields] = await this.pool.execute(sql, values);
	    return rows;
  	}

	async close(){
		await this.pool.end();
	}
	
}

module.exports = new Database();