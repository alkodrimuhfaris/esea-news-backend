const route = require('express').Router()
const authCtlUser = require('../../controllers/user/auth')
const authCtlAdmin = require('../../controllers/admin/auth')

const authMiddleware = require('../../middleware/auth')
const adminChecker = require('../../middleware/adminChecker')

// users
route.post('/user/signup', authCtlUser.signup)
route.post('/user/login', authCtlUser.login)

// admin
route.post('/admin/signup', authMiddleware, adminChecker.admin, authCtlAdmin.signup)
route.post('/admin/login', authCtlAdmin.login)

module.exports = route
