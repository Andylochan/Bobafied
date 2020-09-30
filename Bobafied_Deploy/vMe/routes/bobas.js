var express 	= require("express");
var router 		= express.Router();
var Boba 		= require("../models/boba");
var middleware 	= require("../middleware");

//INDEX ROUTE - Show all bobas
router.get("/", function(req, res){
	var perPage = 8;
	var pageQuery = parseInt(req.query.page);
	var pageNumber = pageQuery ? pageQuery : 1;
	// Get all bobas from DB
	Boba.find({}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, allBobas) {
        Boba.countDocuments().exec(function (err, count) {
            if (err) {
                console.log(err);
            } else {
                res.render("bobas/index", {
                    bobas: allBobas,
                    current: pageNumber,
                    pages: Math.ceil(count / perPage)
                });
            }
        });
    });
});
//CREATE ROUTE - Add new boba to DB
router.post("/", middleware.isLoggedIn, function(req, res){
	//get data from form and add to bobas array
	var name = req.body.name;
	var price = req.body.price; 
	var image = req.body.image;
	var brand = req.body.brand;
	var location = req.body.location;
	var desc = req.body.description; 
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newBoba = {name: name, price: price, image: image, brand: brand, location: location, description: desc, author: author};
	// Create a new boba and save to DB 
	Boba.create(newBoba, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else {
			//redirect back to bobas page
			res.redirect("/bobas");	
		}
	});
});
//NEW ROUTE - Show form to create new boba 
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("bobas/new");
});
//SHOW ROUTE 
router.get("/:id", function(req, res){
	//find the boba with provided ID
	Boba.findById(req.params.id).populate("comments likes").exec(function(err, foundBoba){
		if(err || !foundBoba){
			req.flash("error", "Boba not found");
			res.redirect("back");
		} else {
			//render show template with that boba
			res.render("bobas/show", {boba: foundBoba});
		}
	});
});

//EDIT ROUTE 
router.get("/:id/edit", middleware.checkBobaOwnership, function(req, res){
	Boba.findById(req.params.id, function(err, foundBoba){
		res.render("bobas/edit", {boba: foundBoba});	
	});
});

//UPDATE ROUTE 
router.put("/:id", middleware.checkBobaOwnership, function(req, res){
	// find and update the correct boba, then redirect 
	Boba.findByIdAndUpdate(req.params.id, req.body.boba, function(err, updatedBoba){
		if(err){
			res.redirect("/bobas");
		} else {
			res.redirect("/bobas/" + req.params.id);	
		}
	});
});

//DESTROY ROUTE
router.delete("/:id", middleware.checkBobaOwnership, function(req, res){
	Boba.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/bobas");
		} else {
			res.redirect("/bobas");
		}
	});
});

//Like Route 
router.post("/:id/like", middleware.isLoggedIn, function (req, res) {
    Boba.findById(req.params.id, function (err, foundBoba) {
        if (err) {
            console.log(err);
            return res.redirect("/bobas");
        }

        // check if req.user._id exists in foundBoba.likes
        var foundUserLike = foundBoba.likes.some(function (like) {
            return like.equals(req.user._id);
        });

        if (foundUserLike) {
            // user already liked, removing like
            foundBoba.likes.pull(req.user._id);
        } else {
            // adding the new user like
            foundBoba.likes.push(req.user);
        }

        foundBoba.save(function (err) {
            if (err) {
                console.log(err);
                return res.redirect("/bobas");
            }
            return res.redirect("/bobas/" + foundBoba._id);
        });
    });
});

module.exports = router;