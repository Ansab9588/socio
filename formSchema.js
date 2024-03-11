
const mongoose = require('mongoose');

const APIFormData = new mongoose.Schema({
    firstname: String,
    lastname: String,
    age: Number,
    city: String,
    email: String,
    password: String
},
{
    collection: 'form-data'
}
)

mongoose.model('form-data', APIFormData);