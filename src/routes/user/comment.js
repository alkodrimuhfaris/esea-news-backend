const route = require('express').Router()
const commentAndLikeCtl = require('../../controllers/user/likeAndComment')

const multerSingle = require('../../middlewares/multerSingle')

// comment
route.post('/post', multerSingle('commentPicture'), commentAndLikeCtl.createComment)
route.patch('/update/:id', multerSingle('commentPicture'), commentAndLikeCtl.editCommentByUser)
route.delete('/delete/:id', commentAndLikeCtl.deleteCommentByUser)
route.get('/all/:id', commentAndLikeCtl.getAllCommentsByArticleId)
route.get('/detail/noreplies/:id', commentAndLikeCtl.getCommentById)
route.get('/detail/replies/:id', commentAndLikeCtl.getCommentWithReps)

// comment replies
route.post('/rep/post', multerSingle('commentPicture'), commentAndLikeCtl.createCommentRep)
route.patch('/rep/update/:id', multerSingle('commentPicture'), commentAndLikeCtl.editCommentRepByUser)
route.delete('/rep/delete/:id', commentAndLikeCtl.deleteCommentRepById)
route.get('/rep/all/:id', commentAndLikeCtl.getCommentWithReps)
route.get('/rep/detail/:id', commentAndLikeCtl.getCommentRepById)

module.exports = route
