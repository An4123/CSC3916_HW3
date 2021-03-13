var mongoose = require('mongoose')          // allow us to connect to mongo data base on atlas
var Schema = mongoose.Schema                // need our schema for db

mongoose.Promise = global.Promise;

try{
    mongoose.connect(process.env.DB, {useNewUrlParser: true, useUnifiedTopology: true}, () =>
        console.log("connected"))
} catch(error){
    console.log("could not connect");
}

mongoose.set('useCreateIndex', true)

// Movie schema
var movieSchema = new Schema({
    Title: String,
    release: Number,
    genre: String,
    characters: [{characterName:String, actorName:String}]
});

//return the model to server
module.exports = mongoose.model('Movie', movieSchema);