const userService = require('./user.service')


module.exports = {
    getUser,
    getUsers,
    deleteUser,
    updateUser
}

async function getUser(req, res) {
    const user = await userService.getById(req.params.id)
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
    // console.log('BE update user:', user);
    
    const updatedUser = await userService.update(user)
    console.log('BE update user:', updatedUser);
    res.send(updatedUser)
}
