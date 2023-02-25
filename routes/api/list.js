const express = require('express');
const router = express.Router();
const ctrlList = require('../../controller/list');
const { validateBody } = require('../../middlewares');
const { listSchemas } = require('../../models/list');

// GET

router.get('', ctrlList.getList);

router.get('/:listId', ctrlList.getListById);

// POST

router.post('', validateBody(listSchemas.addListSchema), ctrlList.createList);

// PATCH and PUT

// router.patch('/:listId', validateBody(listSchemas.updateListSchema), ctrlList.updateList);

// UPDATE

router.delete('/:listId', ctrlList.removeList);

module.exports = router;