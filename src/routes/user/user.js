const route = require('express').Router()
const userCtl = require('../../controllers/user/users')

const multerSingle = require('../../middlewares/multerSingle')

route.patch('/update', multerSingle('avatar'), userCtl.updateUser)
route.patch('/update/password', userCtl.changePassword)
route.get('/', userCtl.getUser)
route.delete('/delete', userCtl.deleteUser)

module.exports = route
