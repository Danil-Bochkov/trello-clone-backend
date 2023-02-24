const express = require('express');
const router = express.Router();
const ctrlCard = require('../../controller/card');
const { validateBody } = require('../../middlewares');
const { cardSchemas } = require('../../models/card');

// GET

router.get('/all', ctrlCard.getCard);

router.get('/:cardId', ctrlCard.getCardById);

// POST

router.post('/:listId', validateBody(cardSchemas.addCardSchema), ctrlCard.createCard);

// PUT

router.put('/:cardId', validateBody(cardSchemas.updateCardInfoSchema), ctrlCard.updateCardInfo);

router.patch('/:listId/:cardId', validateBody(cardSchemas.updateCardSchema), ctrlCard.updateCard);

// UPDATE

router.delete('/:cardId', ctrlCard.removeCard);

module.exports = router;