const Joi = require('joi');
const { Schema, model } = require('mongoose');
const { handleMongooseError } = require('../helpers');

const ListSchema = new Schema({
        title: {
            type: String,
            required: true
        },
        cards: [{
            type: Schema.Types.ObjectId,
            ref: 'Card'
        }],
    },
    { versionKey: false, timestamps: true },
);

ListSchema.post('save', handleMongooseError)

const addListSchema = Joi.object({
    title: Joi.string().required()
})

// const updateListSchema = Joi.object({
//     title: Joi.string().required()
// });

const listSchemas = {
    addListSchema,
    // updateListSchema,
}

const List = model('List', ListSchema);

module.exports = { List, listSchemas };