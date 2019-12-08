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
        return items;
    }
    catch (err) {
        console.error('ERROR AGGREGATE: cannot find items')
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
        return item;
    } catch (error) {
        console.error(`ERROR while trying to Find item: ${itemId}`)
        throw error;
    }
}

async function remove(itemId) {
    const collection = await dbService.getCollection('item')
    try {
        itemId = ObjectId(itemId)
        await collection.deleteOne({"_id":itemId})
    } catch (error) {
        console.error(`ERROR with trying to Remove item ${itemId}`)
        throw error;
    }
}

async function update(item) {
    const collection = await dbService.getCollection('item')
    try {
        item._id = ObjectId(item._id)
        item.ownerId = ObjectId(item.ownerId)
        const byUser = item.byUser;
        delete item.byUser;
        const updatedItem = await collection.replaceOne({'_id': item._id}, {$set: item})
        updatedItem.byUser = byUser;
        return updatedItem;
    } catch (error) {
        console.error(`ERROR with trying to Update item ${item._id}`)
        throw error;
    }
}

async function add(item) {    
    const collection = await dbService.getCollection('item')
    try {
        item._id = ObjectId(item._id);
        item.ownerId = ObjectId(item.ownerId);
        await collection.insertOne(item);
        const addedItem = await getById(item._id)
        return addedItem;
    } catch (error) {
        console.error('ERROR with trying to Add item')
        throw error;
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
