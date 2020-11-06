const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const response = require('./helpers/response')

const app = express()
const { APP_PORT } = process.env

app.use(bodyParser.urlencoded({ extended: false }))
app.use(morgan('dev'))
app.use(cors())

app.get('/', (req, res) => {
  response(res, 'Welcome to esea backend!')
})

app.listen(APP_PORT, () => {
  console.log(`App listen on port ${APP_PORT}`)
})
