const itemService = require('./item.service')

module.exports = {
    getItem,
    getItems,
    removeItem,
    updateItem,
    addItem
}


async function getItems(req, res) {
    console.log('getting items')
    const items = await itemService.query(req.query)   // req.query ?  for filterBy
    res.send(items)
}

async function getItem(req, res) {
    const item = await itemService.getById(req.params.id)
    res.send(item)
}

async function removeItem(req, res) {
    await itemService.remove(req.params.id)
    res.send()  // res.send()  ?
}

async function updateItem(req, res) {
    const item = await itemService.update(req.body)
    res.send(item)
}

async function addItem(req, res) {
    const item = await itemService.add(req.body)
    item.ownerId = req.session.user._id; // added
    item.byUser = req.session.user; // added
    // review.aboutUser = {} // added
    res.send(item)
}




