const express = require('express')
const router = express.Router()
const middleware = require('../middleware')
const db = require('../db')

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
  db.query('SELECT entry, meaning, example, book, author FROM word ORDER BY created_on DESC', null, (err, data) => {
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

module.exports = router