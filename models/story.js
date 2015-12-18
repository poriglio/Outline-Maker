var mongoose = require("mongoose")

var storySchema = mongoose.Schema({
	title         : {type:String, default: "Untitled"},
	username      : {type:String},
	parts         : {type:Array},
})

module.exports = mongoose.model("Story",storySchema)