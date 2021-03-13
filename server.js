/*
Name: An Vo
CSC3916 HW3
File: Server.js
Description: Web API scaffolding for Movie API
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
        var User = new User()
        User.name = req.body.name
        User.username = req.body.username
        User.password = req.body.password

        User.save(function(err){
            if (err) {
                if (err.code === 11000) return res.json({success: false, message: 'A user with that username already exist'})
                
                else
                    return res.json(err)
            }
            res.json({success: true, msg: 'Successfully created new user.'})
        })
    }
});

router.post('/signin', function (req, res) {
    var User = db.findOne(req.body.username);
    var userNew = new User();
    userNew.username = req.body.username
    userNew.password = req.body.password

    User.findOne({username: userNew.username}).select('name username password').exec(function(err, user){
        if(err){
            res.send(err)
        }

        user.comparePassword(userNew.password, function(isMatch){
            if(isMatch){
                var userToken = {id: user.id, username: user.username}
                var token = jwt.sign(userToken, process.env.SECRET_KEY)
                res.json({success: true, token: 'JWT ' + token})
            }
            else{
                res.status(401).send({success: false, msg: 'Authentication failed.'})
            }
        })
    })
});

//    I HAVE THIS COMMENTED OUT BECAUSE I WANNA GET EVERYTHING ELSE UP AND RUNNGING FIRST

// router.route('/moviecollection')
//     .post(authJwtController.isAuthenticated, function(req,res){            // create new movie
//         if (!req.body.title || !req.body.release || !req.body.genre || !req.body.characters.characterName || !req.body.characters.actorName){
//             res.json({success: false, msg: 'Please make sure you have entered all fields'})
//         } else {
//             let Movie = new Movie()
//             Movie.title = req.body.title
//             Movie.release = req.body.release
//             Movie.genre = req.body.genre
//             Movie.characters.characterName = req.body.characters.characterName
//             Movie.characters.actorName= req.body.characters.actorName

//             Movie.save(function(err){
//                 if (err) {
//                     console.log(req.body.title, req.body.release, req.body.genre, req.body.characters.actorName, req.body.characters.characterName)
//                     throw err
//                 }
//             })
//         }
//     })

//     .delete(authJwtController.isAuthenticated, function (req,res){          // delete movie
//         Movie.findOneAndRemove({title: req.body.title}, function(err){
//             if (err) {
//                 console.log("could not delete")
//                 throw err
//             } else {console.log("Movie Deleted")}
//         })
//     })

//     .put(authJwtController.isAuthenticated, function (req,res) {        // updates a movie
//         Movie.findOneAndUpdate({title: req.body.title}, {title: req.body.newtitle}, function (err) {
//             if (err) throw err
//         })
//     })

//     .get(authJwtController.isAuthenticated, function (req,res){           // searches for one
//         Movie.findOne({title:req.body.title}, function(err){
//             if (err) throw err
//         })
//     })


app.use('/', router);
app.listen(process.env.PORT || 8080);
module.exports = app; // for testing only


