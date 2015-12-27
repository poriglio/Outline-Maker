var mongoose = require("mongoose")

var outlineSchema = mongoose.Schema({
	title         : {type:String, default: "Untitled"},
	username      : {type:String},
	parts         : {type:Array},
	dateAdded     : {type:Number},
})

module.exports = mongoose.model("Outline",outlineSchema)