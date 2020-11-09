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
const authMiddleware = require('./middlewares/auth')
const adminChecker = require('./middlewares/adminChecker')

// import routes
const roleRoute = require('./routes/admin/roles')
const authRoute = require('./routes/auth/auth')
const userRoute = require('./routes/user/user')
const manageUser = require('./routes/admin/manageUser')
const articleRoute = require('./routes/user/article')
const categoryRoute = require('./routes/admin/category')
const publicRoute = require('./routes/public')
const commentUser = require('./routes/user/comment')
const reactionUser = require('./routes/user/like')

// app use for routes
app.use('/roles', authMiddleware, adminChecker.admin, roleRoute)
app.use('/auth', authRoute)
app.use('/profile', authMiddleware, userRoute)
app.use('/manage/user', authMiddleware, adminChecker.admin, manageUser)
app.use('/user/article', authMiddleware, articleRoute)
app.use('/manage/category', authMiddleware, categoryRoute)
app.use('/public', publicRoute)
app.use('/comment', authMiddleware, commentUser)
app.use('/reaction', authMiddleware, reactionUser)

// image for public
app.use('/Uploads', express.static('./Assets/Public/Uploads'))

app.get('/', (req, res) => {
  response(res, 'Welcome to esea backend!')
})

app.listen(APP_PORT, () => {
  console.log(`App listen on port ${APP_PORT}`)
})
