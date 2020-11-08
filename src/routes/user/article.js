const route = require('express').Router()
const articleCtl = require('../../controllers/user/article')

const multerFields = require('../../middlewares/multerFields')
const multerSingle = require('../../middlewares/multerSingle')
const multerArray = require('../../middlewares/multerArray')

// article
route.post('/post', multerFields(), articleCtl.createArticle)
route.patch('/update/:id', multerSingle('picture'), articleCtl.updateArticle)
route.delete('/delete/:id', articleCtl.deleteArticle)
route.get('/detail/:id', articleCtl.getOwnArticleById)
route.get('/all', articleCtl.getOwnArticles)

// gallery body
route.get('/gallery/:id', articleCtl.getGalleryImage)
route.patch('/gallery/update/:id', multerArray('bodyGallery'), articleCtl.updateGalleryImage)
route.patch('/gallery/delete/:id', articleCtl.deleteGalleryImage)

module.exports = route
