const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let postSchema = new Schema({
    title: {type: String, required: false},
    topic: {type: String, required: false},
	description: {type: String, required: false},
	date: {type: date, required: true}, 
	user: {type: String, required: true},  
	likes: {type: int, required: true}, 
	dislikes: {type: int, required: true}
});
// Export the model
module.exports = mongoose.model('post', postSchema);
