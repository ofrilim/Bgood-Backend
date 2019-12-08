const itemService = require('./item.service')

module.exports = {
    getItem,
    getItems,
    removeItem,
    updateItem,
    addItem
}


async function getItems(req, res) {
    try {
        const items = await itemService.query(req.query)   // req.query ?  for filterBy
        res.send(items) 
    } catch(error){
        res.status(500).send({ error: err })
        logger.log(error)
    }
}

async function getItem(req, res) {
    try {
        const item = await itemService.getById(req.params.id)
        res.send(item)
    } catch(error){
        res.status(500).send({ error: err })
        logger.log(error)
    }
}

async function removeItem(req, res) {
    try {
        await itemService.remove(req.params.id)
        res.send()
    } catch(error) {
        res.status(500).send({ error: err })
        logger.log(error)
    }
}

async function updateItem(req, res) {
    try {
        const item = await itemService.update(req.body)
        res.send(item)
    } catch(error) {
        res.status(500).send({ error })
        logger.log(error)
    }
}

async function addItem(req, res) {
    try {
        var item  = req.body
        const user = req.session.user
        item.ownerId = user._id; 
        const updatedItem = await itemService.add(item)
        res.send(updatedItem)
    } catch(error) {
        res.status(500).send({error})
        logger.log(error)
    }
}




