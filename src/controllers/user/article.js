const { Article } = require('../../models')
const { ArticleGallery } = require('../../models')
const joi = require('joi')
const response = require('../../helpers/response')
const fs = require('fs')
const queryMaker = require('../../helpers/queryMaker')
const pagination = require('../../helpers/pagination')

const { PUBLIC_UPLOAD_FOLDER } = process.env

module.exports = {
  createArticle: async (req, res) => {
    const { id: userId } = req.user
    let { picture, bodyGallery } = req.files

    bodyGallery = bodyGallery
      ? bodyGallery.map(item => {
          item = 'Uploads/' + item.filename
          return item
        })
      : null

    picture = picture ? 'Uploads/' + picture[0].filename : null
    const { title, caption, article, categoryId } = req.body
    const dataBody = { title, caption, article, categoryId, userId }
    picture && Object.assign(dataBody, { picture })
    const scheme = joi.object({
      title: joi.string().required(),
      categoryId: joi.number().required(),
      caption: joi.string().required(),
      article: joi.string().required(),
      picture: joi.string().required(),
      userId: joi.number().required()
    })

    const { value: articleData, error } = scheme.validate(dataBody)
    if (error) {
      picture && fs.unlinkSync(PUBLIC_UPLOAD_FOLDER + picture)
      bodyGallery && bodyGallery.forEach(item => {
        fs.unlinkSync(PUBLIC_UPLOAD_FOLDER + item)
      })
      return response(res, 'Error', { error: error.message }, 400, false)
    }
    try {
      const result = await Article.create(articleData)
      const { id: articleId } = result.dataValues
      const galleries = []
      if (bodyGallery) {
        for (let [i, item] of bodyGallery.entries()) {
          item = {
            articleId,
            userId,
            name: 'bodyGallery' + i,
            imageSrc: item
          }
          item = await ArticleGallery.create(item)
          galleries.push(item.dataValues)
        }
      }
      return response(res, 'Article created!', { result, galleries })
    } catch (err) {
      picture && fs.unlinkSync(PUBLIC_UPLOAD_FOLDER + picture)
      bodyGallery && bodyGallery.forEach(item => {
        fs.unlinkSync(PUBLIC_UPLOAD_FOLDER + item)
      })
      return response(res, err.message, { error: err.message }, 400, false)
    }
  },
  updateArticle: async (req, res) => {
    // destruct picture from req files
    const picture = req.file ? 'Uploads/' + req.file.filename : ''
    const { id: userId } = req.user

    // conditioning article parameter for article id
    let { id } = req.params
    if (!Number(id)) {
      // delete the uploaded file
      picture && fs.unlinkSync(PUBLIC_UPLOAD_FOLDER + picture)
      return response(res, 'Id must be a number!', {}, 400, false)
    }
    id = Number(id)

    try {
      const articleTarget = await Article.findOne({ where: { id, userId } })
      if (!articleTarget) {
        return response(res, 'There is no article in here', {}, 400, false)
      }
      const { title, caption, article, categoryId } = req.body
      const dataBody = { title, caption, article, categoryId }
      picture && Object.assign(dataBody, { picture })
      const scheme = joi.object({
        title: joi.string(),
        categoryId: joi.number(),
        caption: joi.string(),
        article: joi.string(),
        picture: joi.string()
      })

      const { value: articleData, error } = scheme.validate(dataBody)
      if (error) {
        picture && fs.unlinkSync(PUBLIC_UPLOAD_FOLDER + picture)
        return response(res, 'Error', { error: error.message }, 400, false)
      }
      const result = await articleTarget.update(articleData)
      picture && articleData.dataValues.picture && fs.unlinkSync(PUBLIC_UPLOAD_FOLDER + articleData.dataValues.picture)
      return response(res, 'Article updated!', { result })
    } catch (err) {
      picture && fs.unlinkSync(PUBLIC_UPLOAD_FOLDER + picture)
      return response(res, err.message, { error: err.message }, 400, false)
    }
  },
  getGalleryImage: async (req, res) => {
    const { id: articleId } = req.params
    if (!Number(articleId)) {
      return response(res, 'Id must be a number!', {}, 400, false)
    }
    try {
      const results = await ArticleGallery.findAll({ where: { articleId } })
      return response(res, results.length ? 'List of Picture in the Body Article' : 'There is no picture in here', { results })
    } catch (error) {
      return response(res, error.message, { error: error.message }, 400, false)
    }
  },
  updateGalleryImage: async (req, res) => {
    // get picture data
    const bodyGallery = req.file ? 'Uploads/' + req.file.filename : ''
    const { id: userId } = req.user
    // conditioning article parameter forgallery article id
    let { id } = req.params
    if (!Number(id)) {
      // delete the uploaded file
      bodyGallery && fs.unlinkSync(PUBLIC_UPLOAD_FOLDER + bodyGallery)
      return response(res, 'Id must be a number!', {}, 400, false)
    }
    id = Number(id)
    try {
      const galleryPict = await ArticleGallery.findOne({ where: { id, userId } })
      if (!galleryPict) {
        bodyGallery && fs.unlinkSync(PUBLIC_UPLOAD_FOLDER + bodyGallery)
        return response(res, 'There is no picture in here', {}, 400, false)
      }
      await galleryPict.update({ imageSrc: bodyGallery })
      galleryPict.dataValues.imageSrc && fs.unlinkSync(PUBLIC_UPLOAD_FOLDER + galleryPict.dataValues.imageSrc)
      return response(res, 'picture for article updated succesfully!')
    } catch (err) {
      bodyGallery && fs.unlinkSync(PUBLIC_UPLOAD_FOLDER + bodyGallery)
      return response(res, err.message, { error: err.message }, 400, false)
    }
  },
  deleteGalleryImage: async (req, res) => {
    const { id: userId } = req.user
    let { id } = req.params
    if (!Number(id)) {
      return response(res, 'Id must be a number!', {}, 400, false)
    }
    id = Number(id)
    try {
      const galleryPict = await ArticleGallery.findOne({ where: { id, userId } })
      if (!galleryPict) {
        return response(res, 'There is no picture in here', {}, 400, false)
      }
      await galleryPict.destroy()
      galleryPict.dataValues.imageSrc && fs.unlinkSync(PUBLIC_UPLOAD_FOLDER + galleryPict.dataValues.imageSrc)
      return response(res, 'gallery image deleted succesfully')
    } catch (err) {
      return response(res, err.message, { error: err.message }, 400, false)
    }
  },
  deleteArticle: async (req, res) => {
    const { id: userId } = req.user
    let { id } = req.params
    if (!Number(id)) {
      return response(res, 'Id must be a number!', {}, 400, false)
    }
    id = Number(id)
    try {
      const article = await Article.findOne({ where: { id, userId } })
      const galleryBody = await ArticleGallery.findAll({ where: { articleId: id } })
      if (!article) {
        return response(res, 'There is no article in here', {}, 400, false)
      }

      galleryBody.forEach(item => {
        fs.unlinkSync(PUBLIC_UPLOAD_FOLDER + item.imageSrc)
      })

      await article.destroy()
      article.dataValues.picture && fs.unlinkSync(PUBLIC_UPLOAD_FOLDER + article.dataValues.picture)
      return response(res, 'article deleted succesfully')
    } catch (err) {
      return response(res, err.message, { error: err.message }, 400, false)
    }
  },
  getOwnArticleById: async (req, res) => {
    const { id: userId } = req.user
    let { id } = req.params
    if (!Number(id)) {
      return response(res, 'Id must be a number!', {}, 400, false)
    }
    id = Number(id)
    try {
      const article = await Article.findOne({ where: { id, userId } })
      const galleryBody = await ArticleGallery.findAll({ where: { articleId: id } })
      if (!article) {
        return response(res, 'There is no article in here', {}, 400, false)
      }
      console.log(galleryBody)

      return response(res, 'Article on id: ' + id, { article, galleryBody })
    } catch (err) {
      return response(res, err.message, { error: err.message }, 400, false)
    }
  },
  getArticleById: async (req, res) => {
    let { id } = req.params
    if (!Number(id)) {
      return response(res, 'Id must be a number!', {}, 400, false)
    }
    id = Number(id)
    try {
      const article = await Article.findOne({ where: { id } })
      const galleryBody = await ArticleGallery.findAll({ where: { articleId: id } })
      if (!article) {
        return response(res, 'There is no article in here', {}, 400, false)
      }

      // add views on article
      let { views } = article.dataValues
      views += 1
      await article.update({ views })

      console.log(galleryBody)
      return response(res, 'Article on id: ' + id, { article, galleryBody })
    } catch (err) {
      return response(res, err.message, { error: err.message }, 400, false)
    }
  },
  getOwnArticles: async (req, res) => {
    const path = 'user/article/all'
    const { id: userId } = req.user
    const query = {
      ...req.query,
      condition: {
        ...req.query.condition,
        userId
      }
    }
    const { where, order } = queryMaker(query)
    const { limit, page, offset } = pagination.pagePrep(req.query)

    let count = 0
    let results = []

    try {
      if (limit === '-') {
        ({ count, rows: results } = await Article.findAndCountAll({
          order,
          where,
          attributes: { exclude: ['article'] }
        }))
      } else {
        ({ count, rows: results } = await Article.findAndCountAll({
          limit,
          offset,
          order,
          where,
          attributes: { exclude: ['article'] }
        }))
      }
      const pageInfo = pagination.paging(path, req, count, page, limit)

      return response(res, results.length ? 'list article' : 'there is no article in the list', { results, pageInfo })
    } catch (err) {
      return response(res, err.message, { err }, 500, false)
    }
  },
  getAllArticle: async (req, res) => {
    const path = '/article/all'
    const { where, order } = queryMaker(req.query)
    const { limit, page, offset } = pagination.pagePrep(req.query)

    let count = 0
    let results = []

    try {
      if (limit === '-') {
        ({ count, rows: results } = await Article.findAndCountAll({
          order,
          where,
          attributes: { exclude: ['article'] }
        }))
      } else {
        ({ count, rows: results } = await Article.findAndCountAll({
          limit,
          offset,
          order,
          where,
          attributes: { exclude: ['article'] }
        }))
      }
      const pageInfo = pagination.paging(path, req, count, page, limit)

      return response(res, results.length ? 'list article' : 'there is no article in the list', { results, pageInfo })
    } catch (err) {
      return response(res, err.message, { err }, 500, false)
    }
  },
  getArticleByUser: async (req, res) => {
    let { id: userId } = req.params
    if (!Number(userId)) {
      return response(res, 'Id must be a number!', {}, 400, false)
    }
    userId = Number(userId)
    const path = 'public/article/user/' + userId
    const query = {
      ...req.query,
      condition: {
        ...req.query.condition,
        userId
      }
    }
    const { where, order } = queryMaker(query)
    const { limit, page, offset } = pagination.pagePrep(req.query)

    let count = 0
    let results = []

    try {
      if (limit === '-') {
        ({ count, rows: results } = await Article.findAndCountAll({
          order,
          where,
          attributes: { exclude: ['article'] }
        }))
      } else {
        ({ count, rows: results } = await Article.findAndCountAll({
          limit,
          offset,
          order,
          where,
          attributes: { exclude: ['article'] }
        }))
      }
      const pageInfo = pagination.paging(path, req, count, page, limit)

      return response(res, results.length ? 'list article' : 'there is no article in the list', { results, pageInfo })
    } catch (err) {
      return response(res, err.message, { err }, 500, false)
    }
  }
}
