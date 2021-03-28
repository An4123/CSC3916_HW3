let envPath = __dirname + "/../.env";        // "hack" our env path
require('dotenv').config({path:envPath});    // process.env.SECRET_KEY will have a value
let chai = require('chai') ;                // require 'chai'
let chaiHttp = require('chai-http');       // require 'chai-http' to call our web service
let server = require('../server');        // require our server.js file
let User = require('../Users');

chai.use(chaiHttp);        // tell chai to use chaihttp so it can call webservices



var token = ''


let movie_details = {
    title : "Dude Where is My Car 2",
    release : "2000",
    genre : "Comedy",
    characters : 
        [{
            characters : "Jesse Montgomery",
            actorName: "Ashton Kutcher"
        },
        {
            characterName : "Wanda",
            actorName: "Jennifer Garner"
        },
        {
            characterName : "Zoltan",
            actorName: "Hal Sparks"
        }
        ]
}

let login_details = {
    username : "tester",
    password : "12345"
}

let review_details = {
    name : "Bobby Shmurder",
    comment : "Fuck the car, Wheres my hat", 
    rating : "1", 
    titleOfMovie: "Dude Where is My Car"
}

describe('/signin', () => {
    it('will check our log in info', (done) => {   
        chai.request(server)
            .post('/signin')                            
            .send(login_details)                        
            .end((err, res) =>{                         
                console.log(JSON.stringify(res.body))
                // saves us the token
                if(res.body.msg !== 'Authentication failed.') {
                    token = res.body.token;
                }
                done();
            })
    })
})

let movieTitle = {
    title: "Dude Where is My Car"
}

let updatedMovieTitle = {
    title: "Dude Where's My Car"
}

let update_details = {
    originalTitle: "Dude Where is My Car",
    newTitle : "Dude Where's My Car"
}



// describe('/moviecollection GET movie before the update', () => {
//     it('get a movie', (done) => {   
//         chai.request(server)
//             .get('/moviecollection')     
//             .set('Authorization', token)
//             .send(movieTitle)                        
//             .end((err, res) =>{                         
//                 console.log(JSON.stringify(res.body))
//                 done();
//             })
//     })
// })

// describe('/moviecollection PUT', () => {
//     it('update a movie', (done) => {   
//         chai.request(server)
//             .put('/moviecollection')     
//             .set('Authorization', token)
//             .send(update_details)                        
//             .end((err, res) =>{                         
//                 console.log(JSON.stringify(res.body))
//                 done();
//             })
//     })
// })

describe('/moviecollection GET after the update', () => {
    it('get a movie', (done) => {   
        chai.request(server)
            .get('/moviecollection')     
            .set('Authorization', token)
            .send(updatedMovieTitle)                        
            .end((err, res) =>{                         
                console.log(JSON.stringify(res.body))
                done();
            })
    })
})

describe('/moviecollection DELETE ', () => {
    it('DELETE a movie', (done) => {   
        chai.request(server)
            .delete('/moviecollection')     
            .set('Authorization', token)
            .send(updatedMovieTitle)                        
            .end((err, res) =>{                         
                console.log(JSON.stringify(res.body))
                done();
            })
    })
})

describe('/moviecollection GET after the update', () => {
    it('get a movie', (done) => {   
        chai.request(server)
            .get('/moviecollection')     
            .set('Authorization', token)
            .send(updatedMovieTitle)                        
            .end((err, res) =>{                         
                console.log(JSON.stringify(res.body))
                done();
            })
    })
})


// describe('/moviecollection', () => {
//     it('adds a movie to the database', (done) => {   // what should 'it' do
//         chai.request(server)// do a chai request on our server
//             .post('/moviecollection')                            // do a post to 'signup'
//             .set('Authorization', token)
//             .send(movie_details)                            // send our login details
//             .end((err, res) =>{                         // should return error or response
//                 console.log(JSON.stringify(res.body))
//                 // res.should.have.status(200)                 // check if status is 200
//                 // res.body.success.should.be.eql(true);       // should have a body
//                 done();
//             })
//     })
// })


// describe('/reviews', () => {
//     it('adds a review to the database', (done) => {   // what should 'it' do
//         chai.request(server)                            // do a chai request on our server
//             .post('/reviews')                                 // do a post to 'reviews'
//             .set('Authorization', token)
//             .send(review_details)                            // send our login details
//             .end((err, res) =>{                              // should return error or response
//                 console.log(JSON.stringify(res.body))
//                 done();
//             })
//     })
// })


