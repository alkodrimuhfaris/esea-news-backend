const route = require('express').Router()
const authCtlUser = require('../../controllers/user/auth')
const authCtlAdmin = require('../../controllers/admin/auth')

const authMiddleware = require('../../middlewares/auth')
const adminChecker = require('../../middlewares/adminChecker')

// users
route.post('/user/signup', authCtlUser.signup)
route.post('/user/login', authCtlUser.login)
route.post('/user/forgot/password', authCtlUser.sendReset)
route.post('/user/forgot/reset', authCtlUser.resetPassword)

// admin
route.post('/admin/signup', authMiddleware, adminChecker.admin, authCtlAdmin.signup)
route.post('/admin/login', authCtlAdmin.login)
route.post('/admin/forgot/password', authCtlAdmin.sendReset)
route.post('/admin/forgot/reset', authCtlAdmin.resetPassword)

module.exports = route
