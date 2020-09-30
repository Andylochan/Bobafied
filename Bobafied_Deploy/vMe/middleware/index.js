var Boba = require("../models/boba");
var Comment = require("../models/comment");
// all the middleware goes here
var middlewareObj = {};

middlewareObj.checkBobaOwnership = function(req, res, next){
	//is user logged in?
	if(req.isAuthenticated()){
		Boba.findById(req.params.id, function(err, foundBoba){
			if(err || !foundBoba){
				req.flash("error", "Boba not found");
				res.redirect("back");
			} else {
				//does user own the boba?
				if(foundBoba.author.id.equals(req.user._id)){
					next();		
				} else {
					req.flash("error", "You don't have permission to do that");	
					res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "You need to be logged in to do that.....");
		//otherwise, redirect
		res.redirect("back");
	}
}

middlewareObj.checkCommentOwnership = function(req, res, next){
	//is user logged in?
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err || !foundComment){
				req.flash("error", "Comment not found");
				res.redirect("back");
			} else {
				//does user own the comment?
				if(foundComment.author.id.equals(req.user._id)){
					next();	
				} else {
					req.flash("error", "You don't have permission to do that");
					res.redirect("back");
				}
			}
		});		
	} else {
		req.flash("error", "You need to be logged in to do that");		
		//otherwise, redirect
		res.redirect("back");
	}	
}

middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You need to be logged in to do that");
	res.redirect("/login");
}

module.exports = middlewareObj 