const Joi = require('joi')
const { Comment, Like, CommentLike, CommentRep, CommentRepLike } = require('../../models')
const joi = require('joi')
const response = require('../../helpers/response')

module.exports = {
  createComment: async (req, res) => {
    const { id: userId } = req.user
    const { id: articleId } = req.params
    if (!Number(articleId)) {
      return response(res, 'article id must be a number!', {}, 400, false)
    }
    id = Number(articleId)

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
  }
}
