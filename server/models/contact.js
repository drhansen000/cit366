const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contactSchema = mongoose.Schema({
    id: {type: String, required: true},
    name: {type: String, required: true},
    email: {type: String, required: true},
    phone: {type: String, default: ''},
    imageUrl: {type: String, default: ''},
    group: [{type: Schema.Types.ObjectId, ref: 'Contact'}]
});

module.exports = mongoose.model('Contact', contactSchema);