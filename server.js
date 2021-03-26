/*
    Name : An Vo
    Project : Homework 3
    Description : Web API salfolding for Movie API
 */

var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var passport = require('passport');
var authController = require('./auth');
var authJwtController = require('./auth_jwt');
var jwt = require('jsonwebtoken');
var cors = require('cors');
var User = require('./Users');
var Movie = require('./Movies');
var Review = require('./Reviews');

var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
var router = express.Router();

router.post('/signup', function(req, res) {
    // checks if the fields are empty
    if (!req.body.username || !req.body.password) {
        res.json({success: false, msg: 'Please include both username and password to signup.'})
        //if they arent create a user
    }else {
        var user = new User()
        user.name = req.body.name
        user.username = req.body.username
        user.password = req.body.password

        // we save the user and if run into an error then we put the error out
        user.save(function(err){
            if (err) {
                if (err.code === 11000) return res.json({success: false, message: 'A user with that username already exist'})
                else
                    return res.json(err)
            }
            // otherwise send a happy note
            console.log("created new user")
            return res.status(200).json({success: true, message: "Successfully created new user."});
        })
    }
});
router.post('/signin', function (req, res) {
    var userNew = new User();
    userNew.username = req.body.username;
    userNew.password = req.body.password;

    User.findOne({ username: userNew.username }).select('name username password').exec(function(err, user) {
        if (err) {
            res.send(err);
        }

        user.comparePassword(userNew.password, function(isMatch) {
            if (isMatch) {
                var userToken = { id: user.id, username: user.username };
                var token = jwt.sign(userToken, process.env.SECRET_KEY);
                res.json ({success: true, token: 'JWT ' + token});
            }
            else {
                res.status(401).send({success: false, msg: 'Authentication failed.'});
            }
        })
    })
});


router.route('/moviecollection')
    .post(authJwtController.isAuthenticated, function(req,res){            // create new movie
        var movie = new Movie()
        movie.title = req.body.title
        movie.release = req.body.release
        movie.genre = req.body.genre
        movie.characters.characterName = req.body.characters.characterName
        movie.characters.actorName= req.body.characters.actorName
        movie.save(function(err){
            if (err) {
                throw err
            }
        })
    })

//     .delete(authJwtController.isAuthenticated, function (req,res){          // delete movie
//         Movie.findOneAndDelete({title: req.body.title}).select('title genre release characters').exec(function(err, movie){
//             if (err) {
//                 console.log("could not delete")
//                 throw err
//             } 
//             else if (movie == null){
//                 res.json({msg: "Movie not found"})
//             }
//             else {
//                 res.json({msg: "Movie is deleted"})
//             }
//         })
//     })

//     .put(authJwtController.isAuthenticated, function (req,res) {        // updates a movie
//         Movie.findOneAndUpdate({title: req.body.title}, {title: req.body.newtitle}, function (err) {
//             if (err) throw err
//         })
//     })

//     .get(authJwtController.isAuthenticated, function (req,res){           // searches for one
//         Movie.findOne({title: req.body.title}).select('title genre release characters').exec(function(err, movie){
//             if(err){
//                 res.send(err)
//             }
//             console.log(movie.title);
//             console.log(movie.characters.characterName);
//         })
//     })

router.route('/reviews')
    .post(authJwtController.isAuthenticated, function(req,res){            // create new movie
        Movie.findOne({title: req.body.title}).select('title').exec(function(err,movie){
            if (movie != null) {
                if (err){
                    res.json({message: "Movie was not found", error: err})
                } else{
                    let review = new Review()
                    review.nameOfReviewer = req.body.name;
                    review.comment = req.body.comment
                    review.rating = req.body.rating
                    review.titleOfMovie = req.body.title
                    review.movieID = movie.id
                    review.save(function(err){
                        if(err){
                            res.json({success: false, msg: "could not post review"})
                            throw err
                        } else{
                            res.json({success: true, msg: "Review added"})
                        }
                    })
                }
            }
        })
    })


//     .get(authJwtController.isAuthenticated, function(req, res){
//         console.log("get review")
//     })


app.use('/', router);
app.listen(process.env.PORT || 8080);
module.exports = app; // for testing only


