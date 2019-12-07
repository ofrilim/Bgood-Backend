const authService = require('./auth.service')
const logger = require('../../services/logger.service')


module.exports = {
    login,
    signup,
    logout
}

async function login(req, res) {
    const { email, password } = req.body.cred
    try {
        const user = await authService.login(email, password)
        req.session.user = user;
        res.json(user)
    } catch (err) {
        res.status(403).send({ error: err })
    }
}

async function signup(req, res) {
    try {
        const { email, password, firstName, lastName, fullName } = req.body.cred
        logger.debug(email + ", " + firstName + ' ' + lastName + ', ' + password)
        const account = await authService.signup(email, password, firstName, lastName, fullName)
        logger.debug(`auth.route - new account created: ` + JSON.stringify(account))
        const user = await authService.login(email, password)
        req.session.user = user
        res.json(user)
    } catch (err) {
        logger.error('[SIGNUP] ' + err)
        res.status(500).send({ error: 'could not signup, please try later' })
    }
}

async function logout(req, res){
    try {
        req.session.destroy()
        res.send({ message: 'logged out successfully' })
    } catch (err) {
        res.status(500).send({ error: err })
    }
}
