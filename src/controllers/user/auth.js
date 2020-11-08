const { Users } = require('../../models')
const response = require('../../helpers/response')
const joi = require('joi')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { v4: uuidv4 } = require('uuid')
const sendMail = require('../../helpers/sendMail')

module.exports = {
  signup: async (req, res) => {
    // get credentials from body
    const { email, username, name, password, confirmPassword } = req.body
    const data = { email, username, name, password, confirmPassword }

    // validating credetntial from body with joi
    const schema = joi.object({
      email: joi.string().required(),
      username: joi.string().required(),
      name: joi.string().required(),
      password: joi.string().required(),
      confirmPassword: joi.string().required().valid(joi.ref('password'))
    })
    const { value: credentials, error } = schema.validate(data)

    // error handler from joi
    if (error) {
      return response(res, 'Error', { error: error.message }, 400, false)
    }

    try {
      // destruct data from credentials
      let { password, email, username, name } = credentials

      // password hashing
      password = await bcrypt.hash(password, 10)

      // create data to post on database
      const data = { password, email, username, name, roleId: 5 }

      // create new data on database
      const results = await Users.create(data)

      // delete hashed password and adminId to be displayed
      delete results.dataValues.password
      delete results.dataValues.adminId

      // response on success
      return response(res, 'sign up successfully!', { results })
    } catch (err) {
      return response(res, err, {}, 500, false)
    }
  },
  login: async (req, res) => {
    const { email, password } = req.body
    const data = { email, password }

    // schema for joi validate
    const schema = joi.object({
      email: joi.string().required(),
      password: joi.string().required()
    })

    // validate joi
    const { value: credentials, error } = schema.validate(data)

    // error handling on joi
    if (error) {
      return response(res, 'Error', { error: error.message }, 400, false)
    }
    try {
      // check the email address
      const userCheck = await Users.findOne({
        where: {
          email: credentials.email
        }
      })

      // error handling when email address is not found
      if (!userCheck) {
        return response(res, 'Wrong email', {}, 400, false)
      }

      // error handling when non user trying to login in user routes
      if (userCheck.dataValues.roleId !== 5) {
        return response(res, 'Forbidden Access!', {}, 400, false)
      }

      // compare password
      const passCheck = await bcrypt.compare(credentials.password, userCheck.dataValues.password)

      // error handling on wrong password
      if (!passCheck) {
        return response(res, 'Wrong password!', {}, 400, false)
      }

      // sign token
      const token = await jwt.sign({
        id: userCheck.dataValues.id,
        roleId: userCheck.dataValues.roleId,
        adminId: userCheck.dataValues.adminId
      }, process.env.APP_KEY)

      // final response
      return response(res, 'Login Success!', { token })
    } catch (err) {
      return response(res, err.message, {}, 400, false)
    }
  },
  sendReset: async (req, res) => {
    const schema = joi.object({
      email: joi.string().required()
    })
    const { value: emailData, error } = schema.validate(req.body)
    if (error) {
      return response(res, error.message, {}, 400, false)
    }
    try {
      const user = await Users.findOne({ where: emailData })
      if (!user) {
        return response(res, 'Email not found!', {}, 400, false)
      }
      const { name, email } = user.dataValues
      let resetcode = uuidv4()
      resetcode = resetcode.slice(resetcode.length - 8).toUpperCase()

      const result = await sendMail.sendReset(name, email, resetcode)

      console.log(result)

      await user.update({ resetcode })
      return response(res, 'Reset code sent successfully')
    } catch (err) {
      return response(res, error.message, {}, 500, false)
    }
  },
  resetPassword: async (req, res) => {
    const schema = joi.object({
      email: joi.string().email(),
      resetcode: joi.string(),
      newPassword: joi.string(),
      confirmNewPassword: joi.string().required().valid(joi.ref('newPassword'))
    })
    const { value: resetData, error } = schema.validate(req.body)
    if (error) {
      return response(res, error.message, {}, 400, false)
    }
    const { email, resetcode, newPassword } = resetData
    try {
      const user = await Users.findOne({ where: { email } })
      if (!user) {
        return response(res, 'Wrong reset code!', {}, 400, false)
      }
      if (resetcode !== user.dataValues.resetcode || !user.dataValues.resetcode) {
        return response(res, 'Wrong reset code!', {}, 400, false)
      }
      const password = await bcrypt.hash(newPassword, 10)

      await user.update({ password, resetcode: null })
      return response(res, 'Password reset succesfully!')
    } catch (err) {
      return response(res, error.message, {}, 500, false)
    }
  }
}
