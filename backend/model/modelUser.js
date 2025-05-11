const mongoose = require('mongoose');
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
      nom: {
            type: String,
            lowercase: true
      },
      email: {
            type: String,
            unique: true,
            lowercase: true
      },
      password :{
            type: String,
      }

});

userSchema.pre('save', async function (next) {
      const salt = await bcrypt.genSalt(15);
      this.password = await bcrypt.hash(this.password, salt);
      next();
  });


//login user
userSchema.statics.login = async function(email, password) {
      const user = await this.findOne({ email });
    
      if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
          return user;
        }
        throw Error('incorrect password');
      }
      throw Error('incorrect email');
    
    }
  
  
  
  const User = mongoose.model('user', userSchema);
  
  module.exports = User;