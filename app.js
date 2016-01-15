var express = require("express")
var bodyParser = require("body-parser")

var mongoose = require("mongoose")
mongoose.connect("mongodb://localhost/plothound")

var session = require("express-session")
var passport = require("passport")

var passportConfig = require("./config/passport.js")

var app = express()

app.use(session({
	secret 			  : "outlinesaregood",
	resave 			  : true,
	saveUninitialized : true
}))

app.use(passport.initialize())

app.use(passport.session())

app.use(express.static(__dirname + "/public"))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

var authController = require("./controllers/auth.js")

app.get("/",function(request,response){
	response.sendFile("/html/index.html",{root:"./public"})
})

app.post("/auth/signup",function(request,response){
	authController.signup(request,response)
})

app.post("/auth/login",function(request,response){
	authController.login(request,response)
})

app.use(passportConfig.ensureAuthenticated)

// -=-=-=-=-=-=-=-=-=-=-
// AUTHENTICATED ROUTES:
// -=-=-=-=-=-=-=-=-=-=-

var outlineController = require("./controllers/story.js")

app.get("/api/me",function(request,response){
	response.send(request.user)
})

app.get("/api/outline",outlineController.findOutlines)

app.post("/api/outline",outlineController.saveOutline)

app.post("/api/outline/delete",outlineController.deleteOutline)

app.get("/auth/logout",authController.logout)

var port = 3000

app.listen(port,function(){
	console.log("The server is listening on port", port)
})