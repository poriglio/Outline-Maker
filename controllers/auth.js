var passport = require("passport")

var User = require("../models/user.js")

var signup = function(request,response){

	var newUser = new User({
		username      : request.body.username,
		email         : request.body.email,
		password      : request.body.password,
	})

	newUser.save(function(error){
		if(!error){
			response.redirect("/#/confirm/registration")
		}
		else{
			console.log("Error!",error)
		}
	})
}

var performLogin = function(request,response,next,user){
	request.login(user,function(error){
		if(error) return next(error)
		return response.redirect("/#/outlines")
	})
}

var login = function(request,response,next){
	var authFunction = passport.authenticate("local",function(error,user,info){
		if(error) return next(error)
		if(!user){
			return response.redirect("/#/loginerror")
		}
		performLogin(request,response,next,user)
	})
	authFunction(request,response,next)
}

var logout = function(request,response){
		request.logout()
		response.redirect("/")
}

module.exports = {
	signup  : signup,
	login   : login,
	logout  : logout
}