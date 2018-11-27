const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt-nodejs')
const creds = require('../../creds.json')
const db = require('../db')

/*
router.get('/signup', (req, res) => {
  res.render('account/signup')
})
*/

router.get('/', (req, res) => {
  res.render('account/signin')
})

router.post('/', (req, res) => {
  const {email, password} = req.body
  const text = 'SELECT email, passwd FROM account WHERE email = $1'
  db.query(text, [email], (err, data) => {
    if(err) {
      console.log('err:', err)
      return res.json({ok: false})
    }

    const hash = data.rows[0].passwd
    if(bcrypt.compareSync(password, hash)) {
      const token = jwt.sign({email}, creds.jwtsign, { expiresIn: '1 days' })

      res.cookie('token', token)
      res.redirect('/')
    } else {
      res.redirect('/account')
    }

  })
})

router.post('/signup', (req, res) => {
  const {email, password} = req.body

  const saltRounds = 10
  const salt = bcrypt.genSaltSync(saltRounds);
  const passwordHash = bcrypt.hashSync(password, salt)
  
  const text = 'INSERT INTO account(email, passwd) VALUES($1, $2)'
  const values = [email, passwordHash]
  db.query(text, values, (err, data) => {
    if(err) {
      console.log('err:', err)
      return res.json({ok: false})
    }
    res.redirect('/')
  })
});

module.exports = router
