const userService = require('./user.service')

async function getUser(req, res) {
    console.log('BE controller user ID:', req.params.id);
    const user = await userService.getById(req.params.id)
    console.log('BE controller user:', user);
    res.send(user)
}
  
async function getUsers(req, res) {
    const users = await userService.query(req.query)
    res.send(users)
}

async function deleteUser(req, res) {
    await userService.remove(req.params.id)
    res.end()
}

async function updateUser(req, res) {
    const user = req.body;
    await userService.update(user)
    res.send(user)
}

module.exports = {
    getUser,
    getUsers,
    deleteUser,
    updateUser
}