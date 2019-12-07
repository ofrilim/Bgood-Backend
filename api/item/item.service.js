const dbService = require('../../services/db.service')
const ObjectId = require('mongodb').ObjectId

module.exports = {
    query,
    getById,
    remove,
    update,
    add
}


async function query(filterBy = {}) {
    
    const collection = await dbService.getCollection('item')
    const criteria = _buildCriteria(filterBy)
    
    try {
        var items = await collection.find(criteria).toArray();
        // console.log('inside item service query, items:', items);
        items = await collection.aggregate([
            {  
                $lookup: 
                {
                    from: 'user',
                    localField: 'ownerId',
                    foreignField: '_id',
                    as: 'byUser'
                }
            },
            {
                $unwind: '$byUser'
            },
        ]).toArray()
        // console.log('inside item service query, items:', items);

        return items;
    }
    catch (err) {
        console.log('ERROR: cannot find items')
        throw err;
    }
}

async function getById(itemId) {
    const collection = await dbService.getCollection('item')        
    try {
        itemId = ObjectId(itemId)
        var item = await collection.findOne({"_id":itemId})
        item = await collection.aggregate([
            {
                $match: item,
            },
            {  
                $lookup: 
                {
                    from: 'user',
                    localField: 'ownerId',
                    foreignField: '_id',
                    as: 'byUser'
                }
            },
            {
                $unwind: '$byUser'
            },
        ]).toArray()
        item = item[0]
        console.log('BE get by id item:', item);
        
        return item;

    } catch (err) {
        console.log(`ERROR while trying to Find item: ${itemId}`)
        throw err;
    }
}

async function remove(itemId) {
    const collection = await dbService.getCollection('item')
    try {
        itemId = ObjectId(itemId)
        await collection.deleteOne({"_id":itemId})
    } catch (err) {
        console.log(`ERROR with trying to Remove item ${itemId}`)
        throw err;
    }
}

async function update(item) {
    const collection = await dbService.getCollection('item')
    
    try {
        
        item._id = ObjectId(item._id)
        item.ownerId = ObjectId(item.ownerId)
        // item.owner._id = ObjectId(item.owner._id)
        const byUser = item.byUser
        delete item.byUser
        await collection.replaceOne({"_id":item._id}, {$set: item})
        item.byUser = byUser
        return item
    } catch (err) {
        console.log(`ERROR with trying to Update item ${item._id}`)
        throw err;
    }
}

async function add(item) {
    console.log('first item service add item:', item);
    
    const collection = await dbService.getCollection('item')
    try {
        item._id = ObjectId(item._id);
        item.ownerId = ObjectId(item.ownerId);
        await collection.insertOne(item);
        const addedItem = await getById(item._id)
        // console.log('item service add item:', addedItem);
        return addedItem;
    } catch (err) {
        console.log('ERROR with trying to Add item')
        throw err;
    }
}

function _buildCriteria(filterBy) {
    const criteria = {};
    if (filterBy.txt) {
        criteria.name = filterBy.txt
    }
    if (filterBy.minPrice) {
        criteria.price = {$gte : +filterBy.minPrice}
    }
    return criteria;
}
