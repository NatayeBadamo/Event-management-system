const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
      nom :{
            type: String,
            lowercase: true
      },
      description :{
            type: String,
            lowercase: true
      },
      date :{
            type: Date,
      },
      lieu :{
            type: String,
            lowercase: true
      },
      categorie :{
            type: String,
      },
      creator_id: {
            type: mongoose.Schema.Types.ObjectId
      },
      imagePath: String,
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;

