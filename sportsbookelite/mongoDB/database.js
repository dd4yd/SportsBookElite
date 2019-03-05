let mongoose = require('mongoose');

const conn = 'mongodb://root:DTZ2sa4X8Tom@127.0.0.1:27017/mydb?authSource=admin'

class Database {
	constructor() {
		this._connect()
	}


	_connect() {
		mongoose.connect(conn, { useNewUrlParser: true })
		.then(() => {
			console.log('Database connection successful')				})
		.catch(err => {
			console.log('Database connection error')
			throw err
		})
	}

	disconnect() {
		setTimeout(function() {
			mongoose.connection.close()
		}, 1000)
	}
}

module.exports = new Database()
