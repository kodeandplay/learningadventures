const express = require('express')
const cookieParser = require('cookie-parser')
const router = express.Router()
const accountRouter = require('./routes/account')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt-nodejs')
const logger = require('morgan')
const path = require('path')
const middleware = require('./middleware')
const creds = require('../creds.json')
const db = require('./db')
const port = process.env.PORT || 8080
const app = express()


app.set('view engine','ejs')
app.set('views', './views')
// app.use('/public', express.static(__dirname + '/public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

app.use('/', router)
app.use('/account', accountRouter)

router.post('/', middleware, (req, res) => {
  
  const {word, meaning, example, author, book} = req.body
  const text = 'INSERT INTO word(entry, meaning, example, author, book) VALUES($1, $2, $3, $4, $5)'
  const values = [word.trim(), meaning.trim(), example.trim(), author.trim(), book.trim()]
  db.query(text, values, (err, data) => {
    if(err) {
      console.log('err:', err)
      return res.json({ok: false})
    }
    res.redirect('/')
  })
})

router.get('/add', middleware, (req, res) => {
  res.render('form')
})

router.get('/', (req, res) => {
  db.query('SELECT entry, meaning, example, book, author FROM word', null, (err, data) => {
    if(err) {
      console.log('err:', err)
      return res.json({ok: false})
    }
    let citation
    const words = data.rows.map(({entry, meaning, example, book, author}) => {
      if(book.length && author.length) {
        citation = book + ' - ' + author;
      } else {
        citation = book + author
      }

      return { entry, meaning, example, citation }
    })
    res.render('index', { words })
  })
})

const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})

