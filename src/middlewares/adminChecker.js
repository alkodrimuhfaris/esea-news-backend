const { Users } = require('../models')
const response = require('../helpers/response')

module.exports = {
  admin: async (req, res, next) => {
    const { id, adminId } = req.user
    if (!adminId) {
      return response(res, 'forbidden access!', {}, 403, false)
    }
    const userCheck = await Users.findOne({
      where: {
        id,
        adminId
      }
    })
    if (!userCheck) {
      return response(res, 'forbidden access!', {}, 403, false)
    } else {
      return await next()
    }
  },
  mainAdmin: async (req, res, next) => {
    const { id, roleId, adminId } = req.user
    if (!adminId || roleId === 5) {
      return response(res, 'forbidden access!', {}, 403, false)
    }
    const userCheck = await Users.findOne({
      where: {
        id,
        adminId,
        roleId
      }
    })
    if (!userCheck) {
      return response(res, 'forbidden access!', {}, 403, false)
    } else {
      return await next()
    }
  }
}
