const express = require('express')
const router = express.Router()
const middleware = require('../middleware')
const db = require('../db')

router.get('/add', middleware, (req, res) => {
  res.render('flick/add')
})

router.get('/', (req, res) => {
  db.query('SELECT movie, synopsis, rating, trailer FROM flick ORDER BY created_at DESC', null, (err, data) => {
    if(err) {
      console.log('err:', err)
      return res.json({ok: false})
    }
    res.render('flick/view', { flicks: data.rows })
  })
  
})

// assumption is that youtube video id is 11 characters
const stripYoutubeID = (url) => {
  const videoIdLength = 11
  const len = url.length
  return url.substr(len-videoIdLength, videoIdLength)
}

router.post('/', middleware, (req, res) => {
  const author = res.locals.id
  
  const {movie, trailer, synopsis, rating} = req.body
  const trailerId = stripYoutubeID(trailer)
  const text = 'INSERT INTO flick(movie, trailer, synopsis, rating, author) VALUES($1, $2, $3, $4, $5)'
  const values = [movie.trim(), trailerId, synopsis.trim(), rating.trim(), author]
  db.query(text, values, (err, data) => {
    if(err) {
      console.log('err:', err)
      return res.json({ok: false})
    }
    res.redirect('/')
  })
})

module.exports = router