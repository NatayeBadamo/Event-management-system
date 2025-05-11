const jwt = require('jsonwebtoken');
const User = require('../model/modelUser');

const requireAuth = async (req, res, next) => {
      const token = req.cookies.jwt;
    
      if (token) {
        jwt.verify(token, "event", async (err, decodedToken) => {
          if (err) {
            console.log(err.message);
            return res.status(401).json({ message: "Unauthorized" }); // Send response on error
          } else {
            let user = await User.findById(decodedToken.id);
            if (!user) {
              return res.status(404).json({ message: "User not found" });
            }
            res.status(200).json({ user }); // Send the user data
          }
        });
      } else {
        return res.status(401).json({ message: "No token provided" }); // Send response
      }
    }; 
    

const checkUser = (req, res, next) => {
      const token = req.cookies.jwt; 
      if (token) {
          jwt.verify(token, 'event', async (err, decodedToken) => {
              if(err) {
                  console.log(err.message);
                  res.locals.user = null;
                  next();
              } else {
                  console.log(decodedToken);
                  let user = await User.findById(decodedToken.id);
                  res.locals.user = user;
                  next();
              }
          });
      } else {
          res.locals.user = null;
          next();
      }
  }

module.exports = {
      checkUser,
      requireAuth
}