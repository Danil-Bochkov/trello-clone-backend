const { HttpError, ctrlWrapper } = require('../helpers')
const { Card } = require('../models/card');
const { List } = require('../models/list');

const getCard = async (req, res, next) => {
  const results = await Card.find().exec();
  console.log(results);
  res.json(results)
}

const getCardById = async (req, res, next) => {
    const cardId = req.params.cardId;
    const result = await Card.findById(cardId);
    if (!result) {
        throw HttpError(404, 'Not Found')
    }

    res.json(result)
}

const createCard = async (req, res) => {
  const { title, description, listId } = req.body;
  
  const isCardContain = await Card.findOne({ title: title });
  if (isCardContain) {
    throw HttpError(404, "Card with this name already exists");
  }
    
    const newCard = await Card.create({
      title,
      description,
      listId
    });

    const updatedList = await List.findByIdAndUpdate(listId, {
      $push: { cards: newCard._id }
    }, { new: true });
  
    if (!updatedList) {
      throw HttpError(404, 'Not Found')
    }

    return res.status(201).json(newCard);
}

const updateCardInfo = async (req, res, next) => {
  const { cardId, title, description } = req.body
    const result = await Card.findByIdAndUpdate(
      cardId,
      {title, description},
      { new: true }
    );

    if (!result) {
    throw HttpError(404, 'Not Found')
  }
  res.json(result);
}

const updateCard = async (req, res, next) => {
  const { cardId } = req.params;
  const { listId } = req.body;

  const draggedCard = await Card.findById(cardId);
  if (!draggedCard) {
    throw HttpError(404, 'Card not found');
  }

  const updatedDraggedCard = await Card.findByIdAndUpdate(cardId, { listId: listId }, { new: true });
  if (!updatedDraggedCard) {
    throw HttpError(404, 'Updated card not found');
  }

  const getUpdatedDraggedCard = await Card.findById(updatedDraggedCard._id)
  
  const oldList = await List.findByIdAndUpdate(draggedCard.listId, 
    { $pull: { cards: draggedCard._id } },
    { new: true }
  );
  if (!oldList) {
    throw HttpError(404, 'Old list not found');
  }  

  const updatedList = await List.findByIdAndUpdate(listId, {
    $push: { cards: getUpdatedDraggedCard }
  }, { new: true });
  if (!updatedList) {
    throw HttpError(404, 'Updated list not found')
  }

  const oldListCards = await Card.find({ listId: oldList._id })
  console.log('oldListCards', oldListCards);

  const newListCards = await Card.find({ listId: updatedList._id });
  console.log('newListCards', newListCards);

  oldList.cards = oldListCards;
  updatedList.cards = newListCards;

  res.json({updatedList, oldList})
} 

const removeCard = async (req, res, next) => {
     const result = await Card.findByIdAndRemove(req.params.cardId);
     const updatedList = await List.findByIdAndUpdate(
      result.listId,
      { $pull: { cards: result._id } },
      { new: true }
    );
    if (!result) {
        throw HttpError(404, 'Not Found')
    }

    res.json(updatedList)
}

module.exports = {
    getCard: ctrlWrapper(getCard),
    getCardById: ctrlWrapper(getCardById),
    createCard: ctrlWrapper(createCard),
    updateCardInfo: ctrlWrapper(updateCardInfo),
    updateCard: ctrlWrapper(updateCard),
    removeCard: ctrlWrapper(removeCard),
}