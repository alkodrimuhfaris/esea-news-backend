const { Roles } = require('../../models')
const response = require('../../helpers/response')
const pagination = require('../../helpers/pagination')

module.exports = {
  createRole: async (req, res) => {
    const { roleName } = req.body
    if (!roleName) {
      return response(res, 'role name must be entered!', {}, 400, false)
    }

    const results = await Roles.create({ roleName })
    return response(res, 'role is created!', { results })
  },
  getAllRoles: async (req, res) => {
    const path = 'roles/all'
    const { limit, page, offset } = pagination.pagePrep(req.query)
    let count = 0
    let results = []

    if (limit === '-') {
      ({ count, rows: results } = await Roles.findAndCountAll())
    } else {
      ({ count, rows: results } = await Roles.findAndCountAll({ limit, offset }))
    }
    const pageInfo = pagination.paging(path, req, count, page, limit)

    if (results.length) {
      return response(res, 'list all roles', { results, pageInfo })
    } else {
      return response(res, 'there is no roles in here', { pageInfo })
    }
  },
  getRolesById: async (req, res) => {
    let { id } = req.params
    if (!Number(id)) {
      return response(res, 'id must be a number!', {}, 400, false)
    }
    id = Number(id)
    const results = await Roles.findByPk(id)
    if (results) {
      return response(res, 'User on id: ' + id, { results })
    } else {
      return response(res, 'There is no roles in here' + id, { results })
    }
  },
  patchRoles: async (req, res) => {
    let { id } = req.params
    if (!Number(id)) {
      return response(res, 'id must be a number!', {}, 400, false)
    }
    id = Number(id)

    const { roleName } = req.body
    const results = await Roles.findByPk(id)
    if (results) {
      const update = await results.update({ roleName })
      return response(res, 'Role updated successfully', { update })
    } else {
      return response(res, 'Role is not found!', {})
    }
  },
  deleteRoles: async (req, res) => {
    let { id } = req.params
    if (!Number(id)) {
      return response(res, 'id must be a number!', {}, 400, false)
    }
    id = Number(id)

    const results = await Roles.findByPk(id)
    if (results) {
      await results.destroy()
      return response(res, 'Role deleted successfully')
    } else {
      return response(res, 'Role is not found!')
    }
  }

}
