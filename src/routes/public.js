const route = require('express').Router()
const articleCtl = require('../controllers/user/article')
const categoryCtl = require('../controllers/admin/category')

// article
route.get('/article/all', articleCtl.getAllArticle)
route.get('/article/user/:id', articleCtl.getArticleByUser)
route.get('/article/read/:id', articleCtl.getArticleById)
route.get('/article/read/:id/images', articleCtl.getGalleryImage)

// category
route.get('/category/all', categoryCtl.getAllCategory)
route.get('/category/detail/:id', categoryCtl.getCategoryAndArticle)

module.exports = route
