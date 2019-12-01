const express = require('express')
// const requireAuth = require('../../middlewares/requireAuth.middleware')
const { getItem, getItems, removeItem, updateItem, addItem } = require('./item.controller')
const router = express.Router()

// middleware
// router.use(requireAuth)

router.get('/', getItems);
router.get('/:id', getItem);
router.delete('/:id', removeItem);
router.put('/:id', updateItem);
router.post('/', addItem)


module.exports = router