const itemService = require('./item.service')

module.exports = {
    getItem,
    getItems,
    removeItem,
    updateItem,
    addItem
}


async function getItems(req, res) {
    const items = await itemService.query(req.query)   // req.query ?  for filterBy
    res.send(items)
}

async function getItem(req, res) {
    const item = await itemService.getById(req.params.id)
    console.log('BE item controller:', item);
    res.send(item)
}

async function removeItem(req, res) {
    await itemService.remove(req.params.id)
    console.log('remove BE controller:', req.params.id);
    
    res.send()  // res.send()  ?
}

async function updateItem(req, res) {
    const item = await itemService.update(req.body)
    console.log('BE updated item controller:', item);
    
    res.send(item)
}

async function addItem(req, res) {
    const item = await itemService.add(req.body)
    res.send(item)
}




