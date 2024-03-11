
const mongoose = require('mongoose');

const APICardData = new mongoose.Schema({
    title: String,
    content: String
},
{
    collection: 'card-data'
}
)

mongoose.model('card-data', APICardData);