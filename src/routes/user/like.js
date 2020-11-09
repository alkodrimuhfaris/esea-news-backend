const route = require('express').Router()
const likeCtl = require('../../controllers/user/likeAndComment')
const adminChecker = require('../../middlewares/adminChecker')

// Article Reaction
route.post('/article/post/:reaction/:articleId', likeCtl.postAndUpdateReaction)
route.patch('/article/id/patch/:reaction/:id/', likeCtl.updateReactionById)
route.delete('/article/delete/:articleId', likeCtl.deleteReaction)
route.get('/article/all/:id', likeCtl.getArticleReaction)
route.get('/article/detail/:id', likeCtl.getReactionByUserId)

// Article Reaction Admin
route.delete('/article/id/delete/:id', adminChecker.admin, likeCtl.deleteReactionById)

// Comment Reaction
route.post('/comment/post/:reaction/:articleId', likeCtl.postAndUpdateReactionComment)
route.patch('/comment/id/patch/:reaction/:id/', likeCtl.updateReactionCommentById)
route.delete('/comment/delete/:articleId', likeCtl.deleteReactionComment)
route.get('/comment/all/:id', likeCtl.getCommentReaction)
route.get('/comment/detail/:id', likeCtl.getCommentReactionByUserId)

// Comment Reaction Admin
route.delete('/comment/id/delete/:id', adminChecker.admin, likeCtl.deleteReactionCommentById)

// Comment Rep Reaction
route.post('/comment/rep/post/:reaction/:articleId', likeCtl.postAndUpdateReactionCommentRep)
route.patch('/comment/rep/id/patch/:reaction/:id/', likeCtl.updateReactionCommentRepById)
route.delete('/comment/rep/delete/:articleId', likeCtl.deleteReactionCommentRep)
route.get('/comment/rep/all/:id', likeCtl.getCommentRepReaction)
route.get('/comment/rep/detail/:id', likeCtl.getCommentRepReactionByUserId)

// Comment Rep Reaction Admin
route.delete('/comment/rep/id/delete/:id', adminChecker.admin, likeCtl.deleteReactionCommentRepById)

module.exports = route
