var mongoose = require("mongoose")
var bcrypt = require("bcryptjs")

var userSchema = mongoose.Schema({
	username      : {type:String, unique:true, required:true},
	usernameLower : {type:String},
	email         : {type:String,required:true,unique:true},
	password      : {type:String, required:true},
	birthday      : {type:Number},
	dateJoined    : {type:Number},
})

userSchema.pre("save",function(next){
	if(!this.isModified("password")) return next()
	var user = this
	bcrypt.genSalt(10,function(error,salt){
		if(error) return next(error)
		bcrypt.hash(user.password,salt,function(error,hash){
			if(error) return next(error)
			user.password = hash
			return next()
		})
	})
})

userSchema.methods.comparePassword = function(candidatePassword,next){
	bcrypt.compare(candidatePassword,this.password,function(error,isMatch){
		if(error) return next(error)
		return next(null, isMatch)
	})
}

var User = mongoose.model("User",userSchema)
module.exports = User