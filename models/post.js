const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let postSchema = new Schema({
    title: {type: String, required: false},
    topic: {type: String, required: false},
	description: {type: String, required: false},
	date: {type: Date, required: true}, 
	user: {type: String, required: true},  
	likes: {type: Number, required: true}, 
	dislikes: {type: Number, required: true}
});
// Export the model
module.exports = mongoose.model('post', postSchema);
