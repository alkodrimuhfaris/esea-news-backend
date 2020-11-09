const { Comment, Like, CommentLike, CommentRep, CommentRepLike } = require('../../models')
const joi = require('joi')
const response = require('../../helpers/response')
const queryMaker = require('../../helpers/queryMaker')
const pagination = require('../../helpers/pagination')
const sequelize = require('sequelize')

module.exports = {
  createComment: async (req, res) => {
    const { id: userId } = req.user
    let { id: articleId } = req.params
    if (!Number(articleId)) {
      return response(res, 'article id must be a number!', {}, 400, false)
    }
    articleId = Number(articleId)

    const picture = req.file ? 'Uploads/' + req.file.filename : ''

    const schema = joi.object({
      comment: joi.string().required()
    })
    const { value: commentData, error } = schema.validate(req.body)
    if (error) {
      return response(res, error.message, { error }, 400, false)
    }
    picture && Object.assign(commentData, { picture })
    Object.assign(commentData, { userId, articleId })
    try {
      const comment = await Comment.create(commentData)
      return response(res, 'comment added successfully!', { comment })
    } catch (error) {
      return response(res, error.message, { error }, 500, false)
    }
  },
  editComment: async (req, res) => {
    let { id } = req.params
    if (!Number(id)) {
      return response(res, 'comment id must be a number!', {}, 400, false)
    }
    id = Number(id)

    const picture = req.file ? 'Uploads/' + req.file.filename : ''

    const schema = joi.object({
      comment: joi.string()
    })
    const { value: commentData, error } = schema.validate(req.body)
    if (error) {
      return response(res, error.message, { error }, 400, false)
    }
    picture && Object.assign(commentData, { picture })
    try {
      const comment = await Comment.findByPk(id)
      if (!comment) {
        return response(res, 'comment is not exist!', {}, 400, false)
      }
      comment.update(commentData)
      return response(res, 'comment edited successfully!', { comment })
    } catch (error) {
      return response(res, error.message, { error }, 500, false)
    }
  },
  editCommentByUser: async (req, res) => {
    const { id: userId } = req.user
    let { id } = req.params
    if (!Number(id)) {
      return response(res, 'comment id must be a number!', {}, 400, false)
    }
    id = Number(id)

    const picture = req.file ? 'Uploads/' + req.file.filename : ''

    const schema = joi.object({
      comment: joi.string()
    })
    const { value: commentData, error } = schema.validate(req.body)
    if (error) {
      return response(res, error.message, { error }, 400, false)
    }
    picture && Object.assign(commentData, { picture })
    try {
      const comment = await Comment.findOne({ where: { userId, id } })
      if (!comment) {
        return response(res, 'comment is not exist!', {}, 400, false)
      }
      comment.update(commentData)
      return response(res, 'comment edited successfully!', { comment })
    } catch (error) {
      return response(res, error.message, { error }, 500, false)
    }
  },
  deleteCommentById: async (req, res) => {
    let { id } = req.params
    if (!Number(id)) {
      return response(res, 'comment rep id must be a number!', {}, 400, false)
    }
    id = Number(id)
    try {
      const comment = await Comment.findByPk(id)
      if (!comment) {
        return response(res, 'comment is not exist!', {}, 400, false)
      }
      comment.destroy()
      return response(res, 'comment deleted successfully!', {})
    } catch (error) {
      return response(res, error.message, { error }, 500, false)
    }
  },
  deleteCommentByUser: async (req, res) => {
    const { id: userId } = req.user
    let { id } = req.params
    if (!Number(id)) {
      return response(res, 'comment rep id must be a number!', {}, 400, false)
    }
    id = Number(id)
    try {
      const comment = await Comment.findOne({ where: { id, userId } })
      if (!comment) {
        return response(res, 'comment is not exist!', {}, 400, false)
      }
      comment.destroy()
      return response(res, 'comment deleted successfully!', {})
    } catch (error) {
      return response(res, error.message, { error }, 500, false)
    }
  },
  createCommentRep: async (req, res) => {
    const { id: userId } = req.user
    let { id: commentId } = req.params
    if (!Number(commentId)) {
      return response(res, 'article id must be a number!', {}, 400, false)
    }
    commentId = Number(commentId)

    const picture = req.file ? 'Uploads/' + req.file.filename : ''

    const schema = joi.object({
      comment: joi.string().required()
    })
    const { value: commentData, error } = schema.validate(req.body)
    if (error) {
      return response(res, error.message, { error }, 400, false)
    }
    picture && Object.assign(commentData, { picture })
    Object.assign(commentData, { userId, commentId })
    try {
      const comment = await CommentRep.create(commentData)
      return response(res, 'comment added successfully!', { comment })
    } catch (error) {
      return response(res, error.message, { error }, 500, false)
    }
  },
  editCommentRepByUser: async (req, res) => {
    const { id: userId } = req.user
    let { id } = req.params
    if (!Number(id)) {
      return response(res, 'comment rep id must be a number!', {}, 400, false)
    }
    id = Number(id)

    const picture = req.file ? 'Uploads/' + req.file.filename : ''

    const schema = joi.object({
      comment: joi.string()
    })
    const { value: commentData, error } = schema.validate(req.body)
    if (error) {
      return response(res, error.message, { error }, 400, false)
    }
    picture && Object.assign(commentData, { picture })
    try {
      const comment = await CommentRep.findOne({ where: { userId, id } })
      if (!comment) {
        return response(res, 'comment is not exist!', {}, 400, false)
      }
      comment.update(commentData)
      return response(res, 'comment edited successfully!', { comment })
    } catch (error) {
      return response(res, error.message, { error }, 500, false)
    }
  },
  editCommentRep: async (req, res) => {
    let { id } = req.params
    if (!Number(id)) {
      return response(res, 'comment rep id must be a number!', {}, 400, false)
    }
    id = Number(id)

    const picture = req.file ? 'Uploads/' + req.file.filename : ''

    const schema = joi.object({
      comment: joi.string()
    })
    const { value: commentData, error } = schema.validate(req.body)
    if (error) {
      return response(res, error.message, { error }, 400, false)
    }
    picture && Object.assign(commentData, { picture })
    try {
      const comment = await Comment.findByPk(id)
      if (!comment) {
        return response(res, 'comment is not exist!', {}, 400, false)
      }
      comment.update(commentData)
      return response(res, 'comment edited successfully!', { comment })
    } catch (error) {
      return response(res, error.message, { error }, 500, false)
    }
  },
  deleteCommentRepById: async (req, res) => {
    let { id } = req.params
    if (!Number(id)) {
      return response(res, 'comment rep id must be a number!', {}, 400, false)
    }
    id = Number(id)
    try {
      const comment = await CommentRep.findByPk(id)
      if (!comment) {
        return response(res, 'comment is not exist!', {}, 400, false)
      }
      comment.destroy()
      return response(res, 'comment deleted successfully!', {})
    } catch (error) {
      return response(res, error.message, { error }, 500, false)
    }
  },
  deleteCommentRepByUser: async (req, res) => {
    const { id: userId } = req.user
    let { id } = req.params
    if (!Number(id)) {
      return response(res, 'comment rep id must be a number!', {}, 400, false)
    }
    id = Number(id)
    try {
      const comment = await CommentRep.findOne({ where: { id, userId } })
      if (!comment) {
        return response(res, 'comment is not exist!', {}, 400, false)
      }
      comment.destroy()
      return response(res, 'comment deleted successfully!', {})
    } catch (error) {
      return response(res, error.message, { error }, 500, false)
    }
  },
  getAllCommentsByArticleId: async (req, res) => {
    let { id: articleId } = req.params
    if (!Number(articleId)) {
      return response(res, 'article id must be a number!', {}, 400, false)
    }
    articleId = Number(articleId)
    const path = 'article/' + articleId + '/comments'
    let comments = []
    let commentCount = 0
    const { where, order } = queryMaker(req.query)
    const { limit, page, offset } = pagination.pagePrep(req.query)
    try {
      if (limit === '-') {
        ({ count: commentCount, rows: comments } = await Comment.findAndCountAll({
          order,
          where
        }))
      } else {
        ({ count: commentCount, rows: comments } = await Comment.findAndCountAll({
          limit,
          offset,
          order,
          where
        }))
      }
      const pageInfo = pagination.paging(path, req, commentCount, page, limit)

      return response(res, comments.length ? 'list comments' : 'there is no comments in the list', { comments, pageInfo })
    } catch (error) {
      return response(res, error.message, { error }, 500, false)
    }
  },
  getCommentById: async (req, res) => {
    let { id } = req.params
    if (!Number(id)) {
      return response(res, 'comment id must be a number!', {}, 400, false)
    }
    id = Number(id)

    try {
      const comment = await Comment.findByPk(id)
      if (!comment) {
        return response(res, 'comment is not exist!', {}, 400, false)
      }
      return response(res, 'comment on id ' + id, { comment })
    } catch (error) {
      return response(res, error.message, { error }, 500, false)
    }
  },
  getCommentWithReps: async (req, res) => {
    let { id } = req.params
    if (!Number(id)) {
      return response(res, 'comment id must be a number!', {}, 400, false)
    }
    id = Number(id)

    try {
      const comment = await Comment.findByPk(id)
      if (!comment) {
        return response(res, 'comment is not exist!', {}, 400, false)
      }
      const path = 'article/comments/detail' + id
      let commentReps = []
      let commentRepCount = 0
      const query = {
        ...req.query,
        condition: {
          ...req.query.condition,
          commentId: id
        }
      }
      const { where, order } = queryMaker(query)
      const { limit, page, offset } = pagination.pagePrep(req.query)
      if (limit === '-') {
        ({ count: commentRepCount, rows: commentReps } = await CommentRep.findAndCountAll({
          order,
          where
        }))
      } else {
        ({ count: commentRepCount, rows: commentReps } = await CommentRep.findAndCountAll({
          limit,
          offset,
          order,
          where
        }))
      }
      const pageInfo = pagination.paging(path, req, commentRepCount, page, limit)
      const message = commentReps.length ? 'list comments' : 'there is no comments in the list'
      return response(res, message, { comment, commentReps, pageInfo })
    } catch (error) {
      return response(res, error.message, { error }, 500, false)
    }
  },
  getCommentRepById: async (req, res) => {
    let { id } = req.params
    if (!Number(id)) {
      return response(res, 'comment rep id must be a number!', {}, 400, false)
    }
    id = Number(id)

    try {
      const comment = await CommentRep.findByPk(id)
      if (!comment) {
        return response(res, 'comment is not exist!', {}, 400, false)
      }
      return response(res, 'comment on id ' + id, { comment })
    } catch (error) {
      return response(res, error.message, { error }, 500, false)
    }
  },
  postAndUpdateReaction: async (req, res) => {
    let { articleId, reaction } = req.params
    const { id: userId } = req.user
    if (!Number(articleId)) {
      return response(res, 'article id must be a number!', {}, 400, false)
    }
    articleId = Number(articleId)
    const reactionArr = ['like', 'love', 'fine', 'angry', 'dislike']
    const reactionData = {}
    reactionArr.forEach(item => {
      if (item === reaction) {
        Object.assign(reactionData, { [item]: true })
      } else {
        Object.assign(reactionData, { [item]: false })
      }
    })
    let reactionCheck = false
    for (const data in reactionData) {
      if (!data) {
        continue
      } else {
        reactionCheck = true
      }
    }
    if (!reactionCheck) {
      return response(res, 'input the right reaction! [like, love, fine, angry, dislike]', {}, 400, false)
    }
    try {
      Object.assign(reactionData, { articleId, userId })
      const result = await Like.findOne({ where: { articleId, userId } })
      if (result) {
        const { like, love, fine, angry, dislike } = result
        let reactCheck = { like, love, fine, angry, dislike }
        reactCheck = Object.entries(reactCheck).filter(item => item[1])
        const [[react]] = reactCheck
        if (react === reaction) {
          await result.destroy()
          return response(res, 'you assign same reaction, your reaction is deleted')
        } else {
          await result.update(reactionData)
          return response(res, 'your reaction is updated!', { result })
        }
      }
      await Like.create(reactionData)
      return response(res, 'your reaction sent succesfully!', { result })
    } catch (error) {
      return response(res, error.message, { error }, 500, false)
    }
  },
  updateReactionById: async (req, res) => {
    let { id, reaction } = req.params
    if (!Number(id)) {
      return response(res, 'id must be a number!', {}, 400, false)
    }
    id = Number(id)
    const reactionArr = ['like', 'love', 'fine', 'angry', 'dislike']
    const reactionData = {}
    reactionArr.forEach(item => {
      if (item === reaction) {
        Object.assign(reactionData, { [item]: true })
      } else {
        Object.assign(reactionData, { [item]: false })
      }
    })
    let reactionCheck = false
    for (const data in reactionData) {
      if (!data) {
        continue
      } else {
        reactionCheck = true
      }
    }
    if (!reactionCheck) {
      return response(res, 'input the right reaction! [like, love, fine, angry, dislike]', {}, 400, false)
    }
    try {
      const reaction = await Like.findByPk(id)
      if (!reaction) {
        return response(res, 'reaction not found', {}, 400, false)
      }
      await reaction.update(reactionData)
      return response(res, 'reaction updated!', { reaction })
    } catch (error) {
      return response(res, error.message, { error }, 500, false)
    }
  },
  deleteReaction: async (req, res) => {
    let { articleId } = req.params
    const { id: userId } = req.user
    if (!Number(articleId)) {
      return response(res, 'article id must be a number!', {}, 400, false)
    }
    articleId = Number(articleId)
    try {
      const like = await Like.findOne({ where: { articleId, userId } })
      if (!like) {
        return response(res, 'You dont post any reaction here!', {}, 400, false)
      }
      like.destroy()
      return response(res, 'your reaction is deleted!')
    } catch (error) {
      return response(res, error.message, { error }, 500, false)
    }
  },
  postAndUpdateReactionComment: async (req, res) => {
    let { commentId, reaction } = req.params
    const { id: userId } = req.user
    if (!Number(commentId)) {
      return response(res, 'comment id must be a number!', {}, 400, false)
    }
    commentId = Number(commentId)
    const reactionArr = ['like', 'love', 'fine', 'angry', 'dislike']
    const reactionData = {}
    reactionArr.forEach(item => {
      if (item === reaction) {
        Object.assign(reactionData, { [item]: true })
      } else {
        Object.assign(reactionData, { [item]: false })
      }
    })
    let reactionCheck = false
    for (const data in reactionData) {
      if (!data) {
        continue
      } else {
        reactionCheck = true
      }
    }
    if (!reactionCheck) {
      return response(res, 'input the right reaction! [like, love, fine, angry, dislike]', {}, 400, false)
    }
    try {
      Object.assign(reactionData, { commentId, userId })
      const result = await CommentLike.findOne({ where: { commentId, userId } })
      if (result) {
        const { like, love, fine, angry, dislike } = result
        let reactCheck = { like, love, fine, angry, dislike }
        reactCheck = Object.entries(reactCheck).filter(item => item[1])
        const [[react]] = reactCheck
        if (react === reaction) {
          await result.destroy()
          return response(res, 'you assign same reaction, your reaction is deleted')
        } else {
          await result.update(reactionData)
          return response(res, 'your reaction is updated!', { result })
        }
      }
      await Like.create(reactionData)
      return response(res, 'your reaction sent succesfully!', { result })
    } catch (error) {
      return response(res, error.message, { error }, 500, false)
    }
  },
  updateReactionCommentById: async (req, res) => {
    let { id, reaction } = req.params
    if (!Number(id)) {
      return response(res, 'id must be a number!', {}, 400, false)
    }
    id = Number(id)
    const reactionArr = ['like', 'love', 'fine', 'angry', 'dislike']
    const reactionData = {}
    reactionArr.forEach(item => {
      if (item === reaction) {
        Object.assign(reactionData, { [item]: true })
      } else {
        Object.assign(reactionData, { [item]: false })
      }
    })
    let reactionCheck = false
    for (const data in reactionData) {
      if (!data) {
        continue
      } else {
        reactionCheck = true
      }
    }
    if (!reactionCheck) {
      return response(res, 'input the right reaction! [like, love, fine, angry, dislike]', {}, 400, false)
    }
    try {
      const reaction = await CommentLike.findByPk(id)
      if (!reaction) {
        return response(res, 'reaction not found', {}, 400, false)
      }
      await reaction.update(reactionData)
      return response(res, 'reaction updated!', { reaction })
    } catch (error) {
      return response(res, error.message, { error }, 500, false)
    }
  },
  deleteReactionComment: async (req, res) => {
    let { id: commentId } = req.params
    const { id: userId } = req.user
    if (!Number(commentId)) {
      return response(res, 'comment id must be a number!', {}, 400, false)
    }
    commentId = Number(commentId)
    try {
      const like = await CommentLike.findOne({ where: { commentId, userId } })
      if (!like) {
        return response(res, 'You dont post any reaction here!', {}, 400, false)
      }
      like.destroy()
      return response(res, 'your reaction is deleted!')
    } catch (error) {
      return response(res, error.message, { error }, 500, false)
    }
  },
  postAndUpdateReactionCommentRep: async (req, res) => {
    let { id: commentRepId, reaction } = req.params
    const { id: userId } = req.user
    if (!Number(commentRepId)) {
      return response(res, 'comment rep id must be a number!', {}, 400, false)
    }
    commentRepId = Number(commentRepId)
    const reactionArr = ['like', 'love', 'fine', 'angry', 'dislike']
    const reactionData = {}
    reactionArr.forEach(item => {
      if (item === reaction) {
        Object.assign(reactionData, { [item]: true })
      } else {
        Object.assign(reactionData, { [item]: false })
      }
    })
    let reactionCheck = false
    for (const data in reactionData) {
      if (!data) {
        continue
      } else {
        reactionCheck = true
      }
    }
    if (!reactionCheck) {
      return response(res, 'input the right reaction! [like, love, fine, angry, dislike]', {}, 400, false)
    }
    try {
      Object.assign(reactionData, { commentRepId, userId })
      const result = await CommentRepLike.findOne({ where: { commentRepId, userId } })
      if (result) {
        const { like, love, fine, angry, dislike } = result
        let reactCheck = { like, love, fine, angry, dislike }
        reactCheck = Object.entries(reactCheck).filter(item => item[1])
        const [[react]] = reactCheck
        if (react === reaction) {
          await result.destroy()
          return response(res, 'you assign same reaction, your reaction is deleted')
        } else {
          await result.update(reactionData)
          return response(res, 'your reaction is updated!', { result })
        }
      }
      await Like.create(reactionData)
      return response(res, 'your reaction sent succesfully!', { result })
    } catch (error) {
      return response(res, error.message, { error }, 500, false)
    }
  },
  updateReactionCommentRepById: async (req, res) => {
    let { id, reaction } = req.params
    if (!Number(id)) {
      return response(res, 'id must be a number!', {}, 400, false)
    }
    id = Number(id)
    const reactionArr = ['like', 'love', 'fine', 'angry', 'dislike']
    const reactionData = {}
    reactionArr.forEach(item => {
      if (item === reaction) {
        Object.assign(reactionData, { [item]: true })
      } else {
        Object.assign(reactionData, { [item]: false })
      }
    })
    let reactionCheck = false
    for (const data in reactionData) {
      if (!data) {
        continue
      } else {
        reactionCheck = true
      }
    }
    if (!reactionCheck) {
      return response(res, 'input the right reaction! [like, love, fine, angry, dislike]', {}, 400, false)
    }
    try {
      const reaction = await CommentRepLike.findByPk(id)
      if (!reaction) {
        return response(res, 'reaction not found', {}, 400, false)
      }
      await reaction.update(reactionData)
      return response(res, 'reaction updated!', { reaction })
    } catch (error) {
      return response(res, error.message, { error }, 500, false)
    }
  },
  deleteReactionCommentRep: async (req, res) => {
    let { id: commentRepId } = req.params
    const { id: userId } = req.user
    if (!Number(commentRepId)) {
      return response(res, 'comment rep id must be a number!', {}, 400, false)
    }
    commentRepId = Number(commentRepId)
    try {
      const like = await CommentRepLike.findOne({ where: { commentRepId, userId } })
      if (!like) {
        return response(res, 'You dont post any reaction here!', {}, 400, false)
      }
      like.destroy()
      return response(res, 'your reaction is deleted!')
    } catch (error) {
      return response(res, error.message, { error }, 500, false)
    }
  },
  deleteReactionById: async (req, res) => {
    let { id } = req.params
    if (!Number(id)) {
      return response(res, 'id must be a number!', {}, 400, false)
    }
    id = Number(id)
    try {
      const reaction = await Like.findByPk(id)
      if (!reaction) {
        return response(res, 'You dont post any reaction here!', {}, 400, false)
      }
      reaction.destroy()
      return response(res, 'reaction removed succesfully')
    } catch (error) {
      return response(res, error.message, { error }, 500, false)
    }
  },
  deleteReactionCommentById: async (req, res) => {
    let { id } = req.params
    if (!Number(id)) {
      return response(res, 'id must be a number!', {}, 400, false)
    }
    id = Number(id)
    try {
      const reaction = await CommentLike.findByPk(id)
      if (!reaction) {
        return response(res, 'there is no reaction here!', {}, 400, false)
      }
      reaction.destroy()
      return response(res, 'reaction removed succesfully')
    } catch (error) {
      return response(res, error.message, { error }, 500, false)
    }
  },
  deleteReactionCommentRepById: async (req, res) => {
    let { id } = req.params
    if (!Number(id)) {
      return response(res, 'id must be a number!', {}, 400, false)
    }
    id = Number(id)
    try {
      const reaction = await CommentRepLike.findByPk(id)
      if (!reaction) {
        return response(res, 'You dont post any reaction here!', {}, 400, false)
      }
      reaction.destroy()
    } catch (error) {
      return response(res, error.message, { error }, 500, false)
    }
  },
  getArticleReaction: async (req, res) => {
    let { id } = req.params
    if (!Number(id)) {
      return response(res, 'article id must be a number!', {}, 400, false)
    }
    id = Number(id)
    try {
      const result = await Like.findAll({
        where: {
          articleId: id
        },
        attributes: [
          [sequelize.fn('sum', sequelize.col('like')), 'likes'],
          [sequelize.fn('sum', sequelize.col('love')), 'loves'],
          [sequelize.fn('sum', sequelize.col('fine')), 'fine'],
          [sequelize.fn('sum', sequelize.col('angry')), 'angry'],
          [sequelize.fn('sum', sequelize.col('dislike')), 'dislikes']
        ]
      })
      if (!result) {
        return response(res, 'there is no reaction in here', {}, 400, false)
      }
      return response(res, 'reaction on article id: ' + id, { result })
    } catch (error) {
      return response(res, error.message, { error }, 500, false)
    }
  },
  getCommentReaction: async (req, res) => {
    let { id } = req.params
    if (!Number(id)) {
      return response(res, 'article id must be a number!', {}, 400, false)
    }
    id = Number(id)
    try {
      const result = await CommentLike.findAll({
        where: {
          commentId: id
        },
        attributes: [
          [sequelize.fn('sum', sequelize.col('like')), 'likes'],
          [sequelize.fn('sum', sequelize.col('love')), 'loves'],
          [sequelize.fn('sum', sequelize.col('fine')), 'fine'],
          [sequelize.fn('sum', sequelize.col('angry')), 'angry'],
          [sequelize.fn('sum', sequelize.col('dislike')), 'dislikes']
        ]
      })
      if (!result) {
        return response(res, 'there is no reaction in here', {}, 400, false)
      }
      return response(res, 'reaction on article id: ' + id, { result })
    } catch (error) {
      return response(res, error.message, { error }, 500, false)
    }
  },
  getCommentRepReaction: async (req, res) => {
    let { id } = req.params
    if (!Number(id)) {
      return response(res, 'article id must be a number!', {}, 400, false)
    }
    id = Number(id)
    try {
      const result = await CommentRepLike.findAll({
        where: {
          articleId: id
        },
        attributes: [
          [sequelize.fn('sum', sequelize.col('like')), 'likes'],
          [sequelize.fn('sum', sequelize.col('love')), 'loves'],
          [sequelize.fn('sum', sequelize.col('fine')), 'fine'],
          [sequelize.fn('sum', sequelize.col('angry')), 'angry'],
          [sequelize.fn('sum', sequelize.col('dislike')), 'dislikes']
        ]
      })
      if (!result) {
        return response(res, 'there is no reaction in here', {}, 400, false)
      }
      return response(res, 'reaction on article id: ' + id, { result })
    } catch (error) {
      return response(res, error.message, { error }, 500, false)
    }
  },
  getReactionByUserId: async (req, res) => {
    const { id: userId } = req.user
    let { id } = req.params
    if (!Number(id)) {
      return response(res, 'article id must be a number!', {}, 400, false)
    }
    id = Number(id)
    try {
      const result = await Like.findOne({ where: { userId, articleId: id } })
      if (!result) {
        return response(res, 'there is no reaction in here')
      }
      return response(res, 'reaction by user with id: ' + userId, { result })
    } catch (error) {
      return response(res, error.message, { error }, 500, false)
    }
  },
  getCommentReactionByUserId: async (req, res) => {
    const { id: userId } = req.user
    let { id } = req.params
    if (!Number(id)) {
      return response(res, 'article id must be a number!', {}, 400, false)
    }
    id = Number(id)
    try {
      const result = await CommentLike.findOne({ where: { userId, commentId: id } })
      if (!result) {
        return response(res, 'there is no reaction in here')
      }
      return response(res, 'reaction by user with id: ' + userId, { result })
    } catch (error) {
      return response(res, error.message, { error }, 500, false)
    }
  },
  getCommentRepReactionByUserId: async (req, res) => {
    const { id: userId } = req.user
    let { id } = req.params
    if (!Number(id)) {
      return response(res, 'article id must be a number!', {}, 400, false)
    }
    id = Number(id)
    try {
      const result = await CommentRepLike.findOne({ where: { userId, commentRepId: id } })
      if (!result) {
        return response(res, 'there is no reaction in here')
      }
      return response(res, 'reaction by user with id: ' + userId, { result })
    } catch (error) {
      return response(res, error.message, { error }, 500, false)
    }
  }
}
