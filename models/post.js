const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let postSchema = new Schema({
	//img:{data: Buffer, contentType:String}
	title: {type: String, required: false},
	description: {type: String, required: false},
	img: {type: String, required: false}
});
// Export the model
module.exports = mongoose.model('post', postSchema);
//var Item = mongoose.model('Clothes',ItemSchema);