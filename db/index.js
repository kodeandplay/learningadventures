const {Pool} = require('pg')
const creds = require('../../creds.json')

const config = {
  user: creds.user,
  password: creds.password,
  database: creds.database,
  host: 'localhost',
  port: 5432,
  max: 10,
  idleTimeoutMillis: 30000
}

const pool = new Pool(config)

module.exports = {
  query: (text, params, cb) => {
    const start = Date.now()
    return pool.query(text, params, (err, res) => {
      const duration = Date.now() - start
      //console.log('executed query', {text, duration, rows: res.rowCount})
      cb(err, res)
    })
  }
}