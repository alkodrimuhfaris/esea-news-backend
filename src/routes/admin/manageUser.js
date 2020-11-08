const route = require('express').Router()
const userCtl = require('../../controllers/admin/manageUser')

const multerSingle = require('../../middlewares/multerSingle')

route.get('/all', userCtl.getAllUsers)
route.get('/detail/:id', userCtl.getUserById)
route.patch('/update/:id', multerSingle('avatar'), userCtl.updateUser)
route.delete('/delete/:id', userCtl.deleteUserById)
route.patch('/update/password/:id', userCtl.changePassword)

module.exports = route
