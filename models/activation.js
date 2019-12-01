const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let activationSchema = new Schema({
    hash: {type: String, required: true},
});

module.exports = mongoose.model('activation', activationSchema);
