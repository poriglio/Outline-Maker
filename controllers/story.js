var Outline = require("../models/story.js")

var saveOutline = function(request,response){

	Outline.find({_id : request.body._id},function(docs,error){
		if(!docs){

		}
	})

	if(!request.body._id){
		var newOutline = new Outline({
			username    : request.user.username,
			parts       : request.body.parts,
			title       : request.body.title, 
		})

		newOutline.save(function(error){
		})
	}
	else{
		Outline.update({_id : request.body._id},{username : request.user.username, parts : request.body.parts, title : request.body.title},function(error){
			
		})
	}

}

var findOutlines = function(request,response){
	var user = request.user.username
	Outline.find({username : user},function(error,docs){
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
	saveOutline    : saveOutline,
	findOutlines   : findOutlines,
	deleteList     : deleteList
}