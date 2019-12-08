// const bcrypt = require('bcrypt')
const userService = require('../user/user.service')
const logger = require('../../services/logger.service')

const saltRounds = 10

module.exports = {
    login,
    signup
}

async function login(email, password) {
    logger.debug(`auth.service - login with email: ${email}`)
    if (!email || !password) return Promise.reject('email and password are required!')
    const user = await userService.getByEmail(email)
    if (!user) return Promise.reject('Invalid email or password')
    if (user.password !== password) return Promise.reject('Not Authorized!')
    // If will be decided to work with bcrypt
    // const match = await bcrypt.compare(password, user.password)
    // if (!match) return Promise.reject('Invalid email or password')
    // console.log('auth service user:', user);    
    delete user.password;
    return user;
}

async function signup(email, password, firstName, lastName, fullName, imgUrl, location, wishList) {
    logger.debug(`auth.service - signup with email: ${email}, fullname: ${firstName}`+`${lastName}`)
    if (!email || !password || !(firstName || lastName)) return Promise.reject('email, username and password are required!')

    // If will be decided to work with bcrypt
    // const hash = await bcrypt.hash(password, saltRounds)
    // return userService.add({ email, password: hash, username })
    return userService.add({ email, password, firstName , lastName, fullName,  imgUrl, location, wishList })
}

