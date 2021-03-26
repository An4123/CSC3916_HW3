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

// Review schema
var reviewSchema = new Schema({
    nameOfReviewer: {type: String, required : true,},
    comment: {type: String},
    rating: {type: String, required : true},
    titleOfMovie: {type: String, required : true},
    movieID: {type : mongoose.Types.ObjectId, required: true}
});

//return the model to server
module.exports = mongoose.model('Review', reviewSchema);