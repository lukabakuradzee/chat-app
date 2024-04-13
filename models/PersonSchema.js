const mongoose = require('mongoose');

const PersonSchema = new mongoose.Schema({
    name: String,
    lastName: String,
    email: String,
    age: String,
    image: String,
    userPosts: Number,
    followersCount: Number,
    followingCount: Number,
    address: {
        street: String,
        city: String,
        state: String,
        zip: String
    },
    interests: [String]

})

const Person = mongoose.model('Person', PersonSchema);

module.exports = Person;