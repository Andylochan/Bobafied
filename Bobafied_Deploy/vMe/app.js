var express 		= require("express"),
	app 			= express(),
	bodyParser		= require("body-parser"),
	mongoose 		= require("mongoose"),
	flash 			= require("connect-flash"),
	moment 			= require("moment"),
	passport		= require("passport"),
	LocalStrategy 	= require("passport-local"),
	methodOverride	= require("method-override"),
	Boba	 		= require("./models/boba"),
	Comment 		= require("./models/comment"),
	User 			= require("./models/user"),
	seedDB 			= require("./seeds");

// Required Routes 
var commentRoutes 	= require("./routes/comments"),
 	bobaRoutes		= require("./routes/bobas"),
 	indexRoutes 	= require("./routes/index");

// mongoose.connect("mongodb://localhost:27017/bobafied_v2", {
mongoose.connect(process.env.DATABASEURL, {
	useNewUrlParser: true ,
	useCreateIndex: true,
	useUnifiedTopology: true, 
	useFindAndModify: false
}).then(() => {
	console.log("Connected to BobaDB!");
}).catch(err => {
	console.log("ERROR", err.message);
});	

app.use(bodyParser.urlencoded({extended: true})); //Memorize or just copy/paste 
app.set("view engine", "ejs"); //No need to use .ejs in throughout app 
app.use(express.static(__dirname + "/public")); 
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment=require("moment");
//seedDB();

// PASSPORT CONFIG
app.use(require("express-session")({
	secret: "Shibas",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use(indexRoutes);
app.use("/bobas", bobaRoutes);
app.use("/bobas/:id/comments", commentRoutes);

app.listen(process.env.PORT || 3000, function(){
	console.log("Bobafied Server Started");
});
