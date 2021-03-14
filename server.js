/*
    Name : Artsiom Skarakhod
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



var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(passport.initialize());

var router = express.Router();

function getJSONObjectForMovieRequirement(req) {
    var json = {
        headers: "No headers",
        key: process.env.UNIQUE_KEY,
        body: "No body"
    };

    if (req.body != null) {
        json.body = req.body;
    }

    if (req.headers != null) {
        json.headers = req.headers;
    }

    return json;
}

router.post('/signup', function(req, res) {
    if (!req.body.username || !req.body.password) {
        res.json({success: false, msg: 'Please include both username and password to signup.'})
    } else {
        var user = new User();
        user.name = req.body.name;
        user.username = req.body.username;
        user.password = req.body.password;

        user.save(function(err){
            if (err) {
                if (err.code == 11000)
                    return res.json({ success: false, message: 'A user with that username already exists.'});
                else
                    return res.json(err);
            }
            res.json({success: true, msg: 'Successfully created new user.'})
        });
    }
});

// router.post('/signin', function(req, res) {
//     var userNew = new User();
//     userNew.username = req.body.username;
//     userNew.password = req.body.password;

//     User.findOne({username: userNew.username }).select('name username password').exec(function(err, user) {
//         if (err){ 
//             res.send(err)
//         }
//         user.comparePassword(userNew.password, function(isMatch){
//             if (isMatch) {
//                 var userToken = {id: user._id, username: user.username};
//                 var token = jwt.sign(userToken, process.env.SECRET_KEY);
//                 console.log(token)
//                 res.json({success: true, token: 'JWT ' + token});
//             }
//             else {
//                 res.status(401).send({success: false, message: 'Authentication failed.'});
//             }
//         });
//     });
// });


// router.route('/moviecollection')
//     .post(authJwtController.isAuthenticated, function(req,res){            // create new movie
//         var numOfChars = req.body.characters.size;
//         var error = false;
//         // goes thru character array inside of the body and makes sure that all the info si there
//         for(var i = 0; i< numOfChars;i++) {
//             if(req.body.characters[i].characterName === ''|| req.body.characters[i].characterName === '')
//             {
//                 error = true;
//                 if(error)
//                 {
//                     break;
//                 }
//             }
//         }

//         if (req.body.title === ''|| req.body.release === '' || req.body.genre === ''|| error ){
//             res.json({success: false, msg: 'Please make sure you have entered all fields'})
//         } else {
//             var movie = new Movie()
//             movie.title = req.body.title
//             movie.release = req.body.release
//             movie.genre = req.body.genre
//             movie.characters.characterName = req.body.characters.characterName
//             movie.characters.actorName= req.body.characters.actorName
//             movie.save(function(err){
//                 if (err) {
//                     throw err
//                 }
//             })
//         }
//     })

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


app.use('/', router);
app.listen(process.env.PORT || 8080);
module.exports = app; // for testing only


