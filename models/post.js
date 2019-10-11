const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let postSchema = new Schema({
    title: {type: String, required: false},
    topic: {type: String, required: false},
	description: {type: String, required: false},
	date: {type: Date, required: false}, 
	user: {type: String, required: false},  
	likes: {type: Number, required: false}, 
	dislikes: {type: Number, required: false}
});
// Export the model
module.exports = mongoose.model('post', postSchema);
