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

// import middleware
const authMiddleware = require('./middleware/auth')
const adminChecker = require('./middleware/adminChecker')

// import routes
const roleRoute = require('./routes/admin/roles')
const authRoute = require('./routes/auth/auth')

// app use for routes
app.use('/roles', authMiddleware, adminChecker.admin, roleRoute)
app.use('/auth', authRoute)

app.get('/', (req, res) => {
  response(res, 'Welcome to esea backend!')
})

app.listen(APP_PORT, () => {
  console.log(`App listen on port ${APP_PORT}`)
})
