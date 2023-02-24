const Joi = require('joi');
const { Schema, model } = require('mongoose');
const { handleMongooseError } = require('../helpers');

const CardSchema = new Schema({
        title: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        listId: {
            type: Schema.Types.ObjectId,
            ref: 'List'
        },
    },
    { versionKey: false, timestamps: true },
);

CardSchema.post('save', handleMongooseError)

const addCardSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string(),
    listId: Joi.string().required(),
})

const updateCardInfoSchema = Joi.object({
    cardId: Joi.string().required(),
    title: Joi.string().required(),
    description: Joi.string()
});

const updateCardSchema = Joi.object({
    listId: Joi.string().required(),
});

const cardSchemas = {
    addCardSchema,
    updateCardInfoSchema,
    updateCardSchema
}

const Card = model('Card', CardSchema);

module.exports = { Card, cardSchemas };