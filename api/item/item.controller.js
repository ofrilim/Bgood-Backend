const itemService = require('./item.service')

module.exports = {
    getItem,
    getItems,
    removeItem,
    updateItem,
    addItem
}


async function getItems(req, res) {
    // console.log('getting items')
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
    var item  = req.body
    const user = req.session.user
    // console.log('addItem user:', user);
    // console.log('addItem user session id:', req.session.user._id);
    // console.log('addItem item:', req.body);
    
    item.ownerId = user._id; 
    const updatedItem = await itemService.add(req.body)
    // console.log('item controller updated item:'. updatedItem);
    // review.aboutUser = {} // added
    res.send(updatedItem)
}




