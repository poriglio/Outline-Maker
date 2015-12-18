var Story = require("../models/story.js")

var saveStory = function(request,response){
	var newStory = new Story({
		username    : request.user.username,
		parts       : request.body.parts,
		title       : request.body.title, 
	})

	newStory.save(function(error){
	})
}

var getLists = function(request,response){
	var user = request.user.username
	List.find({username : user},function(error,docs){
		response.send(docs)
	})
}

var deleteList = function(request,response){
	var user = request.user.username
	var id = request.body.id
	List.remove({_id : id,username:user},function(error,docs){
		response.redirect("/#/profile")
	})
}

module.exports = {
	saveStory   : saveStory,
	getLists   : getLists,
	deleteList : deleteList
}