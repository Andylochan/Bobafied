var mongoose = require("mongoose");

// SCHEMA SETUP
var bobaSchema = new mongoose.Schema({
	name: String,
	price: String, 
	image: String,
	brand: String,
	location: String, 
	description: String, 
	createdAt: { type: Date, default: Date.now },
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String 
	},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	],
	likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
});

module.exports = mongoose.model("Boba", bobaSchema); //Exports the mongoose model 