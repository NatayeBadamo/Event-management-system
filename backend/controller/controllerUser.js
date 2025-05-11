const User = require('../model/modelUser');
const bcrypt = require('bcrypt');


const jwt = require('jsonwebtoken');

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({id}, 'event', {
        expiresIn: maxAge
    });
}

const signin = async (req, res) => {
      const {nom, email, password} = req.body;
  
      try {
          const user = await User.create({nom, email, password});
          res.status(201).json({user});
      }
      catch (errors){
          res.status(400).json({errors});
      }
  }
  
  const login = async (req, res) => {
      const { email, password } = req.body;
  
      try {
          const user = await User.login(email, password); 
          const token = createToken(user._id);
          res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
          res.status(200).json();
      } catch (errors) {
          res.status(400).json({ errors });
      }
  }

const logout = (req, res) => {
    res.cookie('jwt', '', { httpOnly: true, expires: new Date(0) }); 
    console.log("User logged out");
    res.status(200).json({ message: "Logout successful" }); 
};


module.exports  = {
      login,
      signin,
      logout
}