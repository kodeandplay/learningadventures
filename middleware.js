const jwt = require('jsonwebtoken')
const creds = require('../creds.json')
const db = require('./db')

module.exports = (req, res, next) => {
  const {token} = req.cookies
  if(!token) return res.redirect('/')

  try {
    const decoded = jwt.verify(token, creds.jwtsign)
    const {email, id} = decoded;
    
    if(email) {
      db.query('SELECT email FROM account WHERE email = $1', [email], (err, data) => {
        if(err || data.rowCount !== 1) {
          return res.redirect('/')
        }
        res.locals.id = id
        next()
      })
    }
  } catch(err) {
    console.log('err:', err)
    return res.redirect('/')
  }
}
