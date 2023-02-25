const { HttpError, ctrlWrapper } = require('../helpers');
const { Card } = require('../models/card');
const { List } = require('../models/list');

const getList = async (req, res, next) => {
  const results = await List.find().populate('cards');
    res.json(results)
}

const getListById = async (req, res, next) => {
  const { listId } = req.params
    const result = await List.findById(listId);
    if (!result) {
        throw HttpError(404, 'Not Found')
    }

    res.json(result)
}

const createList = async (req, res) => {
  const data = req.body;

  const checkedCard = await List.findOne({ title: data.title });
  if (checkedCard) {
    throw HttpError(404, "List with this name already exists");
  }

  const result = await List.create(data);

  res.status(201).json(result)
}

// const updateList = async (req, res, next) => {
//   const { listId } = req.params
//   const { title } = req.body
//   console.log("listId", listId);
//   console.log("Body", title);
//   const result = await List.findByIdAndUpdate(listId, {title: title}, {new: true});
//   if (!result) {
//     throw HttpError(404, 'Not Found')
//   }
//   res.json(result);
// }

const removeList = async (req, res, next) => {
  const { listId } = req.params;

  const IsCardContains = await Card.findOne({ listId: listId })
  if (IsCardContains) {
    throw HttpError(404, 'You should clear list from cards before delete hole list.')
  }

  const result = await List.findByIdAndRemove(listId);
  
  if (!result) {
    throw HttpError(404, 'Not Found')
  }

    res.json(result)
}

module.exports = {
    getList: ctrlWrapper(getList),
    getListById: ctrlWrapper(getListById),
    createList: ctrlWrapper(createList),
    // updateList: ctrlWrapper(updateList),
    removeList: ctrlWrapper(removeList),
}