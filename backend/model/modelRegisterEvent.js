const mongoose = require("mongoose");

const registerSchema = new mongoose.Schema({
      nom_user :{
            type: String,
            lowercase: true
      },
      email_user :{
            type: String,
            lowercase: true
      },
      phone_user :{
            type: Number,
      },
      event_id: {
            type: mongoose.Schema.Types.ObjectId
      },
      user_id: {
            type: mongoose.Schema.Types.ObjectId
      }
});

const Register = mongoose.model('Register', registerSchema);

module.exports = Register;