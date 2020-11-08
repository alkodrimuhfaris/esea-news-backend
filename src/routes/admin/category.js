const route = require('express').Router()
const categoryCtl = require('../../controllers/admin/category')

const multerSingle = require('../../middlewares/multerSingle')

route.post('/create', multerSingle('categoryPicture'), categoryCtl.createCategory)
route.patch('/update/:id', multerSingle('categoryPicture'), categoryCtl.updateCategory)
route.delete('/delete/:id', categoryCtl.deleteCategory)
route.get('/detail/:id', categoryCtl.getCategoryById)
route.get('/all', categoryCtl.getAllCategory)

module.exports = route
