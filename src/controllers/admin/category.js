const { Category, Users } = require('../../models')
const joi = require('joi')
const response = require('../../helpers/response')
const fs = require('fs')
const queryMaker = require('../../helpers/queryMaker')
const pagination = require('../../helpers/pagination')
const sequelize = require('sequelize')
const { Article } = require('../../models')

const { PUBLIC_UPLOAD_FOLDER } = process.env

module.exports = {
  createCategory: async (req, res) => {
    const { categoryName } = req.body
    const categoryPicture = req.file ? 'Uploads/' + req.file.filename : ''
    const data = { categoryName, categoryPicture }
    const schema = joi.object({
      categoryName: joi.string().required(),
      categoryPicture: joi.string().required()
    })
    const { value: categoryData, error } = schema.validate(data)
    if (error) {
      categoryPicture && fs.unlinkSync(PUBLIC_UPLOAD_FOLDER + categoryPicture)
      return response(res, error.message, { error }, 400, false)
    }

    try {
      const result = await Category.create(categoryData)
      return response(res, 'category created successfully!', { result })
    } catch (err) {
      categoryPicture && fs.unlinkSync(PUBLIC_UPLOAD_FOLDER + categoryPicture)
      return response(res, err.message, { err }, 400, false)
    }
  },
  updateCategory: async (req, res) => {
    let { id } = req.params
    const categoryPicture = req.file ? 'Uploads/' + req.file.filename : ''

    if (!Number(id)) {
      // delete the uploaded file
      categoryPicture && fs.unlinkSync(PUBLIC_UPLOAD_FOLDER + categoryPicture)
      return response(res, 'Id must be a number!', {}, 400, false)
    }
    id = Number(id)
    const { categoryName } = req.body
    const data = { categoryName }

    // schema for body
    const schema = joi.object({
      categoryName: joi.string()
    })
    const { value: categoryData, error } = schema.validate(data)
    if (error) {
      categoryPicture && fs.unlinkSync(PUBLIC_UPLOAD_FOLDER + categoryPicture)
      return response(res, error.message, { error }, 400, false)
    }
    categoryPicture && Object.assign(categoryData, { categoryPicture })
    try {
      const category = await Category.findByPk(id)
      if (!category) {
        return response(res, 'Category is not found!', {}, 400, false)
      }
      const result = await category.update(categoryData)
      categoryPicture && category.dataValues.categoryPicture && fs.unlinkSync(PUBLIC_UPLOAD_FOLDER + category.dataValues.categoryPicture)
      return response(res, 'category created successfully!', { result })
    } catch (err) {
      categoryPicture && fs.unlinkSync(PUBLIC_UPLOAD_FOLDER + categoryPicture)
      return response(res, err.message, { err }, 400, false)
    }
  },
  deleteCategory: async (req, res) => {
    let { id } = req.params
    if (!Number(id)) {
      return response(res, 'Id must be a number!', {}, 400, false)
    }
    id = Number(id)
    try {
      const category = await Category.findByPk(id)
      if (!category) {
        return response(res, 'Category is not found!', {}, 400, false)
      }
      await category.destroy()
      category.dataValues.categoryPicture && fs.unlinkSync(PUBLIC_UPLOAD_FOLDER + category.dataValues.categoryPicture)
      return response(res, 'category deleted successfully!')
    } catch (err) {
      return response(res, err.message, { err }, 400, false)
    }
  },
  getAllCategory: async (req, res) => {
    const path = 'manage/category/all'
    const { where, order } = queryMaker(req.query)
    const { limit, page, offset } = pagination.pagePrep(req.query)
    let count = 0
    let results = []

    try {
      if (limit === '-') {
        ({ count, rows: results } = await Category.findAndCountAll({
          order,
          where
        }))
      } else {
        ({ count, rows: results } = await Category.findAndCountAll({
          limit,
          offset,
          order,
          where
        }))
      }
      const pageInfo = pagination.paging(path, req, count, page, limit)

      return response(res, results.length ? 'list item' : 'there is no category in the list', { results, pageInfo })
    } catch (err) {
      return response(res, err.message, { err }, 500, false)
    }
  },
  getCategoryById: async (req, res) => {
    let { id } = req.params
    if (!Number(id)) {
      return response(res, 'Id must be a number!', {}, 400, false)
    }
    id = Number(id)
    try {
      const result = await Category.findOne({
        where: { id },
        include: [{
          model: Article,
          attributes: [[sequelize.fn('count', sequelize.col('categoryId')), 'articleCount']]
        }]
      })

      return response(res, result ? 'Category on id: ' + id : 'there is no category in the list', { result })
    } catch (err) {
      return response(res, err.message, { err }, 500, false)
    }
  },
  getCategoryAndArticle: async (req, res) => {
    let { id } = req.params
    if (!Number(id)) {
      return response(res, 'Id must be a number!', {}, 400, false)
    }
    id = Number(id)
    try {
      const category = await Category.findOne({ where: { id } })
      const path = '/category/detail/' + id

      let count = 0
      let articles = []

      const { limit, page, offset } = pagination.pagePrep(req.query)

      if (category) {
        const query = {
          ...req.query,
          condition: {
            ...req.query.condition,
            categoryId: id
          }
        }
        const { where, order } = queryMaker(query)

        if (limit === '-') {
          ({ count, rows: articles } = await Article.findAndCountAll({
            order,
            where,
            attributes: {
              exclude: ['article'],
              include: [
                [sequelize.literal(`(
                  SELECT SUBSTRING(article, 1, 200) AS articleSpoiler FROM Articles GROUP BY Article.id
                  )`
                ), 'articleSpoiler'],
                [sequelize.literal(`(
                  SELECT ROUND((LENGTH(article)-LENGTH(REPLACE(article,' ','')))/200, 1) FROM Articles GROUP BY Article.id
                  )`), 'estimationReadTime']
              ]
            },
            include: [
              {
                model: Users,
                as: 'Author',
                attributes: [
                  'name'
                ]
              },
              {
                model: Category,
                attributes: [
                  'categoryPicture',
                  'categoryName'
                ]
              }
            ]
          }))
        } else {
          ({ count, rows: articles } = await Article.findAndCountAll({
            limit,
            offset,
            order,
            where,
            attributes: {
              exclude: ['article'],
              include: [
                [sequelize.literal(`(
                SELECT SUBSTRING(article, 1, 200) AS articleSpoiler FROM Articles GROUP BY Article.id
                )`
                ), 'articleSpoiler'],
                [sequelize.literal(`(
                SELECT ROUND((LENGTH(article)-LENGTH(REPLACE(article,' ','')))/200, 1) FROM Articles GROUP BY Article.id
                )`), 'estimationReadTime']
              ]
            },
            include: [
              {
                model: Users,
                as: 'Author',
                attributes: [
                  'name'
                ]
              },
              {
                model: Category,
                attributes: [
                  'categoryPicture',
                  'categoryName'
                ]
              }
            ]
          }))
        }
      }

      const pageInfo = pagination.paging(path, req, count, page, limit)

      return response(res, category ? 'Category on id: ' + id : 'there is no category in the list', { category, articles, pageInfo })
    } catch (err) {
      return response(res, err.message, { err }, 500, false)
    }
  }
}
