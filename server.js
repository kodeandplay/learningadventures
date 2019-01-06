const express = require('express')
const cookieParser = require('cookie-parser')
const flickRouter = require('./routes/flick')
const wordRouter = require('./routes/word')
const accountRouter = require('./routes/account')
const bodyParser = require('body-parser')

const logger = require('morgan')
const port = process.env.PORT || 8080
const app = express()


app.set('view engine','ejs')
app.set('views', './views')
app.use(express.static(__dirname + '/assets'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

app.use('/', wordRouter)
app.use('/account', accountRouter)
app.use('/flick', flickRouter)


const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})

