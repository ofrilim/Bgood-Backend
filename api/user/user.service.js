
const dbService = require('../../services/db.service')
// const reviewService = require('../review/review.service')
const ObjectId = require('mongodb').ObjectId

module.exports = {
    query,
    getById,
    getByEmail,
    remove,
    update,
    add
}

async function query(filterBy = {}) {
    const criteria = _buildCriteria(filterBy)
    const collection = await dbService.getCollection('user')
    try {
        const users = await collection.find(criteria).toArray();
        users.forEach(user => delete user.password);
        return users
    } catch (err) {
        console.log('ERROR: cannot find users')
        throw err;
    }
}

async function getById(userId) {
    const collection = await dbService.getCollection('user')
    try {
        var user = await collection.findOne({"_id":ObjectId(userId)})
        user = await collection.aggregate([
            {   
                $match: user   
            }, 
            {  
                $lookup: 
                {
                    from: 'item',
                    localField: 'wishList',
                    foreignField: '_id',
                    as: 'itemsOnWishList'
                }
            },
            {
                $lookup:
                {
                    from: 'item',
                    localField: '_id',
                    foreignField: 'ownerId',
                    as: 'ownItems'
                }
            },
        ]).toArray()
        user = user[0] 
        delete user.password
        // user.givenReviews = await reviewService.query({byUserId: ObjectId(user._id) })
        // user.givenReviews = user.givenReviews.map(review => {
        //     delete review.byUser
        //     return review
        // })
        return user
    } catch (err) {
        console.log(`ERROR: while finding user ${userId}`)
        throw err;
    }
}

async function getByEmail(email) {
    const collection = await dbService.getCollection('user')
    try {
        var user = await collection.findOne({email})
        user = await collection.aggregate([
            {   
                $match: user   
            },
            {  
                $lookup: 
                {
                    from: 'item',
                    localField: 'wishList',
                    foreignField: '_id',
                    as: 'itemsOnWishList'
                }
            },
            {
                $lookup:
                {
                    from: 'item',
                    localField: '_id',
                    foreignField: 'ownerId',
                    as: 'ownItems'
                }
            },
        ]).toArray()
        user = user[0] 
        console.log('BE user servie user:', user);
        
        return user
    } catch (err) {
        console.log(`ERROR: while finding user ${email}`)
        throw err;
    }
}

async function remove(userId) {
    const collection = await dbService.getCollection('user')
    try {
        await collection.deleteOne({"_id":ObjectId(userId)})
    } catch (err) {
        console.log(`ERROR: cannot remove user ${userId}`)
        throw err;
    }
}

async function update(user) {
    const collection = await dbService.getCollection('user')
    // var userToUpdate = user
    user._id = ObjectId(user._id);
    delete user.itemsOnWishList
    delete user.ownItems
    if (user.wishList){
        user.wishList.map(itemId => {
            itemId = ObjectId(itemId)
            console.log('itemId map:', itemId);
            console.log('type of item id:', typeof(itemId));
            return itemId            
        })
    }
    try {
        // const {itemsOnWishList, ownItems} = user
        // console.log('itemsOnWishList:', itemsOnWishList);
        // console.log('ownItems:', ownItems);
        // console.log(user.wishList);
        await collection.replaceOne({"_id":user._id}, {$set : user})

        // user.itemsOnWishList = itemsOnWishList
        // user.ownItems = ownItems
        user = await collection.aggregate([
            {   
                $match: user   
            },
            {
                $lookup:
                {
                    from: 'item',
                    localField: '_id',
                    foreignField: 'ownerId',
                    as: 'ownItems'
                }
            },
            {  
                $lookup: 
                {
                    from: 'item',
                    localField: 'wishList',
                    foreignField: '_id',
                    as: 'itemsOnWishList'
                }
            },
        ]).toArray()
        user = user[0] 
        delete user.password
        console.log('user updated:', user);
        
        return user
    } catch (err) {
        console.log(`ERROR: cannot update user ${user._id}`)
        throw err;
    }
}

async function add(user) {
    const collection = await dbService.getCollection('user')
    try {
        await collection.insertOne(user);
        return user;
    } catch (err) {
        console.log(`ERROR: cannot insert user`)
        throw err;
    }
}

function _buildCriteria(filterBy) {
    const criteria = {};
    if (filterBy.txt) {
        criteria.username = filterBy.txt
    }
    return criteria;
}


