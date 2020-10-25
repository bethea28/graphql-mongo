const mongoose = require('mongoose')
const findOrCreate = require('mongoose-findorcreate')

// let Schema = mongoose.Schema;

const BookSchema = new mongoose.Schema({
  title: String,
  author: String,
})

BookSchema.plugin(findOrCreate)

module.exports = { BookSchema }
// module.exports = mongoose.model("Person", PersonSchema);
