const { Article, Comment, Like, CommentLike, CommentRep, CommentRepLike } = require('../../models')
const joi = require('joi')
const response = require('../../helpers/response')
const queryMaker = require('../../helpers/queryMaker')
const pagination = require('../../helpers/pagination')

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
    const { value: commentData, error } = schema.valudate(req.body)
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
    const { value: commentData, error } = schema.valudate(req.body)
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
    const { value: commentData, error } = schema.valudate(req.body)
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
    const { value: commentData, error } = schema.valudate(req.body)
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
    const { value: commentData, error } = schema.valudate(req.body)
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
    const { value: commentData, error } = schema.valudate(req.body)
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
  getAllComments: async (req, res) => {
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
      const comment = Comment.findByPk(id)
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
      const comment = Comment.findByPk(id)
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
      const comment = CommentRep.findByPk(id)
      if (!comment) {
        return response(res, 'comment is not exist!', {}, 400, false)
      }
      return response(res, 'comment on id ' + id, { comment })
    } catch (error) {
      return response(res, error.message, { error }, 500, false)
    }
  },
  createLike: async (req, res) => {
    let { id } = req.params
    if (!Number(id)) {
      return response(res, 'comment rep id must be a number!', {}, 400, false)
    }
    id = Number(id)
    
    try {

    } catch (error) {
      return response(res, error.message, { error }, 500, false)
    }
  }
}
