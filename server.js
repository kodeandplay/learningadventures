const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const logger = require('morgan')
const path = require('path')
const db = require('./db')

const port = process.env.PORT || 8080
const app = express()

app.set('view engine','ejs')
app.set('views', './views')
// app.use('/public', express.static(__dirname + '/public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/', router)

router.post('/', (req, res) => {
  const {word, meaning, example} = req.body
  const text = 'INSERT INTO word(entry, meaning, example) VALUES($1, $2, $3)'
  const values = [word, meaning, example]
  db.query(text, values, (err, data) => {
    if(err) return res.json({ok: false})
    res.redirect('/')
  })
})

router.get('/add', (req, res) => {
  res.render('form')
})

router.get('/', (req, res) => {
  db.query('SELECT entry, meaning, example FROM word', null, (err, data) => {
    if(err) return res.json({ok: false})
    res.render('index', { words: data.rows })
  })
})

const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})

