const { Users } = require('../../models')
const response = require('../../helpers/response')
const joi = require('joi')
const bcrypt = require('bcryptjs')
const fs = require('fs')

const {
  PUBLIC_UPLOAD_FOLDER
} = process.env

module.exports = {
  updateUser: async (req, res) => {
    // get data from token
    const { id } = req.user

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
      if (err.message === 'Validation error') {
        let { errors } = err
        errors = errors.map(item => {
          return ({
            message: item.message,
            type: item.type,
            path: item.path
          })
        })
        return response(res, err.message, { errors }, 500, false)
      }
      return response(res, err.message, { err }, 500, false)
    }
  },
  getUser: async (req, res) => {
    try {
      const { id } = req.user
      const result = await Users.findByPk(id)
      delete result.dataValues.password
      if (!result) {
        return response(res, 'user not found', {}, 404, false)
      }
      return response(res, 'data user', { result })
    } catch (err) {
      return response(res, err.message, { err }, 500, false)
    }
  },
  deleteUser: async (req, res) => {
    const { id } = req.user
    try {
      const result = await Users.findByPk(id)
      delete result.dataValues.password
      if (!result) {
        return response(res, 'user not found', {}, 404, false)
      }
      await result.destroy()
      result.dataValues.avatar && fs.unlinkSync(PUBLIC_UPLOAD_FOLDER + result.dataValues.avatar)
      return response(res, 'user deleted successfully', { result })
    } catch (err) {
      return response(res, err.message, { err }, 500, false)
    }
  },
  changePassword: async (req, res) => {
    const { id } = req.user
    const { oldPassword, newPassword, confirmNewPassword } = req.body
    const passData = { oldPassword, newPassword, confirmNewPassword }
    const scheme = joi.object({
      oldPassword: joi.string().required(),
      newPassword: joi.string().required(),
      confirmNewPassword: joi.string().required().valid(joi.ref('newPassword'))
    })
    const { value: dataPass, error } = scheme.validate(passData)

    if (error) {
      return response(res, 'Error', { error: error.message }, 400, false)
    }

    try {
      const { newPassword, oldPassword } = dataPass
      const result = await Users.findByPk(id)

      // compare password
      const passCheck = await bcrypt.compare(oldPassword, result.dataValues.password)

      // error handling on wrong password
      if (!passCheck) {
        return response(res, 'Wrong password!', {}, 400, false)
      }

      // password hashing
      const password = await bcrypt.hash(newPassword, 10)

      await result.update({ password })
      return response(res, 'Password updated succesfully!')
    } catch (err) {
      return response(res, err.message, { err }, 500, false)
    }
  }
}
