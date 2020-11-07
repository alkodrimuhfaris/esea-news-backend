const route = require('express').Router()
const rolesCtl = require('../../controllers/admin/roles')

route.post('/create', rolesCtl.createRole)
route.get('/all', rolesCtl.getAllRoles)
route.get('/detail/:id', rolesCtl.getRolesById)
route.patch('/update/:id', rolesCtl.patchRoles)
route.delete('/delete/:id', rolesCtl.deleteRoles)

module.exports = route
