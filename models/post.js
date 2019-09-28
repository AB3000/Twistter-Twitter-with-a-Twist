const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let postSchema = new Schema({
	title: {type: String, required: false},
	description: {type: String, required: false},
});
// Export the model
module.exports = mongoose.model('post', postSchema);
