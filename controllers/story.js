var Outline = require("../models/story.js")

var saveOutline = function(request,response){

	console.log("controller reached")

	Outline.find({_id : request.body._id},function(docs,error){
		if(!docs){

		}
	})

	if(!request.body._id){
		
		var d = new Date();
		var n = d.getTime();

		var newOutline = new Outline({
			username    : request.user.username,
			parts       : request.body.parts,
			title       : request.body.title, 
			dateAdded   : +n,
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

var deleteOutline = function(request,response){
	console.log("controller reacher")
	var user = request.user.username
	console.log(request.body)
	var id = request.body.id
	Outline.remove({_id : id,username:user},function(error,docs){
	})
}

module.exports = {
	saveOutline    : saveOutline,
	findOutlines   : findOutlines,
	deleteOutline     : deleteOutline
}