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
    console.log('coolection:', collection);
    
    try {
        const items = await collection.find(criteria).toArray();

        // const items = await collection.aggregate([
        //     {
        //         "$project": {
        //           "_id": {
        //             "$toString": "$_id"
        //           }
        //         }
        //       },

        //     {  

        //         $lookup: 
        //         {
        //             from: 'user',
        //             localField: 'ownerId',
        //             foreignField: 'ObjectId(_id)',
        //             as: 'byUser'
        //         }
        //     },
        //     {
        //         $unwind: '$byUser'
        //     },
        // ]).toArray()
    console.log('inside item service query, items:', items);

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
        const item = await collection.findOne({"_id":itemId})
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
        await collection.replaceOne({"_id":item._id}, {$set: item})
        return item;
    } catch (err) {
        console.log(`ERROR with trying to Update item ${item._id}`)
        throw err;
    }
}

async function add(item) {
    const collection = await dbService.getCollection('item')
    try {
        await collection.insertOne(item);
        return item;
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
