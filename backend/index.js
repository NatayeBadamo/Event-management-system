const express = require("express");
const routeUser = require("./route/routeUser");
const routeEvent = require("./route/routeEvent");
const routeRegister = require("./route/routeRegisterEvent");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");


const app = express();
const PORT = process.env.PORT || 4000;

mongoose.connect('mongodb://localhost:27017/event_Manager');

const db = mongoose.connection;
db.on('error', (error) => console.error('MongoDB connection error:', error));
db.once('open', () => console.log('Connected to MongoDB'));

app.use(
      cors({
        origin: "http://localhost:5173", // Update with your frontend URL
        credentials: true, // Allow cookies and authentication headers
      })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use(cookieParser());

app.get("/getUser", (req, res) => {
      try {
            const token = req.cookies.token; // Extract the token from the cookie
            if (!token) return res.status(401).json({ message: "Unauthorized" });

            const decoded = jwt.verify(token, "event"); // Verify JWT token
            res.json({ user_id: decoded.userId });
      } catch (error) {
            res.status(500).json({ message: "Error retrieving user ID" });
      }
});



app.use(routeUser);
app.use(routeEvent);
app.use(routeRegister)

app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
})