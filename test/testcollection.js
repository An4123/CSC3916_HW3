let envPath = __dirname + "/../.env";        // "hack" our env path
require('dotenv').config({path:envPath});    // process.env.SECRET_KEY will have a value
let chai = require('chai') ;                // require 'chai'
let chaiHttp = require('chai-http');       // require 'chai-http' to call our web service
let server = require('../server');        // require our server.js file
let User = require('../Users');

chai.should();
chai.use(chaiHttp);        // tell chai to use chaihttp so it can call webservices


let login_details = {
    name : 'test',
    username : 'email@email.com',
    password : '123@abc'
}

let movie_details = {
    title : 'scary',
    release : '2020',
    genre : 'horror',
    characters : { 
        characterName: 'bill',
        actorName: 'bil'
    }
}



// describe("test sign up method", () => {
//     it('sign up and save user to database', (done) => {
//         chai.request(server)
//             .post('/signup')
//             .send(login_details)
//             .end((err,res) =>{
//                 res.should.have.status(200)
//             })
//     })
// })

describe ('register, login and Call Test Collection with Basic Auth and JWT Auth', () => {
// line above will describe the test we are running.

    // before each test initialize db as empty
    beforeEach((done) => {    // before each test
        done()
    })

    // after each test, empty the test
    after((done) => {         // after each test
        User.deleteOne({name: 'test'}, function(err, user){
            if (err) {
                throw err
            }
        })
        done()
    })

    // Test the GET route
    describe('/signup', () => {
        it('it should register, login and check our token', (done) => {   // what should 'it' do
            chai.request(server)                            // do a chai request on our server
                .post('/signup')                            // do a post to 'signup'
                .send(login_details)                        // send our login details
                .end((err, res) =>{                         // should return error or response
                    res.should.have.status(200)                 // check if status is 200
                    res.body.success.should.be.eql(true);       // should have a body
                    chai.request(server)                             // do a nother chai request
                        .post('/signin')                             // send a post to 'signin'
                        .send(login_details)                         // send login_details
                        .end((err,res)=>{                            // should return error or response
                            res.should.have.status(200)              // check if status is 200
                            res.body.should.have.property('token');  // make sure youre getting a token back
                            let token = res.body.token;

                            chai.request(server)                // call a server reqest on our server
                                .put('/testcollection')         // do a put from /testcollection
                                .set('Authorization', token)    // set authorization token to token
                                .send({echo: ''})               // set echo to ''
                                .end((err,res) =>{              // should return error or response
                                    res.should.have.status(200)        // should have a 200 status
                                    res.body.body.should.have.property('echo')  // should have a body
                                    done();
                                })
                        })
                })
        });
    })
})
