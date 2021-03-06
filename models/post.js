const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let postSchema = new Schema({
    title: {type: String, required: false},
    topic: {type: String, required: false},
    subtopics: {type: [String], required: false}, 
	description: {type: String, required: false},
	date: {type: Date, required: false}, 
	user: {type: String, required: false},  
	likes: {type: Number, required: false}, 
	dislikes: {type: Number, required: false},
	quote: {type: Boolean, required: false},
	isRemoved: {type: Boolean, required: false},
	quoted_id: {type: String, required: false},
	comment: {type: String, required: false},
	originalAuthor: {type: String, required: false}
});
// Export the model
module.exports = mongoose.model('post', postSchema);
