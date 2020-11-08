const { Users } = require('../../models')
const response = require('../../helpers/response')
const pagination = require('../../helpers/pagination')
const queryMaker = require('../../helpers/queryMaker')
const joi = require('joi')
const fs = require('fs')
const bcrypt = require('bcryptjs')

const { PUBLIC_UPLOAD_FOLDER } = process.env

module.exports = {
  getAllUsers: async (req, res) => {
    const path = 'manage/user/all'
    const { where, order } = queryMaker(req.query)
    const { limit, page, offset } = pagination.pagePrep(req.query)
    let count = 0
    let results = []

    try {
      if (limit === '-') {
        ({ count, rows: results } = await Users.findAndCountAll({
          order,
          where
        }))
      } else {
        ({ count, rows: results } = await Users.findAndCountAll({
          limit,
          offset,
          order,
          where
        }))
      }
      const pageInfo = pagination.paging(path, req, count, page, limit)

      return response(res, results.length ? 'list item' : 'there is no users in the list', { results, pageInfo })
    } catch (err) {
      return response(res, err.message, { err }, 500, false)
    }
  },
  getUserById: async (req, res) => {
    let { id } = req.params
    if (!Number(id)) {
      return response(res, 'Id must be a number!', {}, 400, false)
    }
    id = Number(id)
    try {
      const results = await Users.findByPk(id)
      if (!results) {
        return response(res, 'Id not found', {}, 400, false)
      }
      return response(res, 'User on id: ' + id, { results })
    } catch (err) {
      return response(res, err.message, { err }, 500, false)
    }
  },
  deleteUserById: async (req, res) => {
    let { id } = req.params
    if (!Number(id)) {
      return response(res, 'Id must be a number!', {}, 400, false)
    }
    id = Number(id)
    try {
      const result = await Users.findByPk(id)
      if (!result) {
        return response(res, 'Id not found', {}, 400, false)
      }
      await result.destroy()
      result.dataValues.avatar && fs.unlinkSync(PUBLIC_UPLOAD_FOLDER + result.dataValues.avatar)
      return response(res, 'User on id: ' + id + ' has been deleted')
    } catch (err) {
      return response(res, err.message, { err }, 500, false)
    }
  },
  updateUser: async (req, res) => {
    // get data from params
    let { id } = req.params
    if (!Number(id)) {
      return response(res, 'Id must be a number!', {}, 400, false)
    }
    id = Number(id)

    // get data from body
    const {
      name, username, birthdate, email, phone
    } = req.body

    // get data from multer middleware
    const avatar = req.file ? 'Upload/' + req.file.filename : undefined

    const data = {
      name, username, birthdate, email, phone, avatar
    }

    const schema = joi.object({
      name: joi.string(),
      username: joi.string(),
      birthdate: joi.string(),
      email: joi.string().email(),
      phone: joi.string(),
      avatar: joi.string()
    })

    const { value: updateData, error } = schema.validate(data)
    if (error) {
      avatar && fs.unlinkSync(PUBLIC_UPLOAD_FOLDER + avatar)
      return response(res, 'Error', { error: error.message }, 400, false)
    }

    try {
      const userCheck = await Users.findByPk(id)
      if (!userCheck) {
        return response(res, 'User not found!', {}, 500, false)
      }

      // change status email to be unverified
      if (updateData.email) {
        Object.assign(updateData, { emailverif: false })
      }

      const update = await userCheck.update(updateData)
      userCheck.dataValues.avatar && fs.unlinkSync(PUBLIC_UPLOAD_FOLDER + userCheck.dataValues.avatar)
      return response(res, 'user updated successfully!', { update }, 200, true)
    } catch (err) {
      avatar && fs.unlinkSync(PUBLIC_UPLOAD_FOLDER + avatar)
      return response(res, err.message, { err }, 500, false)
    }
  },
  changePassword: async (req, res) => {
    // get data from params
    let { id } = req.params
    if (!Number(id)) {
      return response(res, 'Id must be a number!', {}, 400, false)
    }
    id = Number(id)

    const { newPassword, confirmNewPassword } = req.body
    const passData = { newPassword, confirmNewPassword }
    const scheme = joi.object({
      newPassword: joi.string().required(),
      confirmNewPassword: joi.string().required().valid(joi.ref('newPassword'))
    })
    const { value: dataPass, error } = scheme.validate(passData)

    if (error) {
      return response(res, 'Error', { error: error.message }, 400, false)
    }

    try {
      let { newPassword } = dataPass
      const result = await Users.findByPk(id)

      // password hashing
      newPassword = await bcrypt.hash(newPassword, 10)

      await result.update({ password: newPassword })
      return response(res, 'Password updated succesfully!')
    } catch (err) {
      return response(res, err.message, { err }, 500, false)
    }
  }
}
