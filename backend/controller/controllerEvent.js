const Event = require('../model/modelEvent');
const fs = require("fs"); // Import filesystem module
const path = require("path");
const User = require('../model/modelUser');
require('dotenv').config({ path: '.env' });
const nodemailer = require("nodemailer");


const event_post = async (req, res) => {
  const creator_id = req.params.creator_id;
  const { nom, description, date, lieu, categorie } = req.body;

  const imagePath = `/uploads/${req.file.filename}`;

  try {
    const users = await User.find({}, "email");

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: "natayeodrien@gmail.com",
      subject: `New Event: ${nom}`,
      text: `Un nouvelle événement à été poster!\n\nEvent: ${nom}\nDescription: ${description}\nDate: ${date}\nLocation: ${lieu}`,
    };

    for (const user of users) {
      mailOptions.to = user.email;
      await transporter.sendMail(mailOptions);
    }
  
    const event = new Event({
      nom,
      description,
      date,
      lieu,
      categorie,
      creator_id,
      imagePath: imagePath,
    });

    await event.save();
    res.json({ message: "Event saved and notifications sent", event });
  } catch (error) {
    console.error("Error sending emails or saving event:", error);
    res.status(500).json({ errorMessage: "Internal server error" });
  }
};
  

const update_event = async (req, res) => {
      const event_id = req.params.event_id;
      const {nom, description, date, lieu, catégorie, } = req.body;
      console.log(event_id, nom, description, date, lieu, catégorie);

      const imagePath = `/uploads/${req.file.filename}`;

      try {
            const updateEvent = await Event.findByIdAndUpdate(event_id, {
                  nom: nom,
                  description: description,
                  date: date,
                  lieu: lieu,
                  catégorie: catégorie,
                  imagePath: imagePath
            }, {new: true});
 
            res.json({ message: 'Event updated', event: updateEvent});
      } catch (error) {
            console.error('error updating', error);
            res.status(500).json({error: 'Internal server error'}); 
      } 
}

const delete_event = async (req, res) => {
      const event_id = req.params.event_id;
      console.log("Deleting event:", event_id);
    
      try {
        // Find the event to get the image path
        const event = await Event.findById(event_id);
        if (!event) {
          return res.status(404).json({ error: "Event not found" });
        }
    
        // Delete the image from the uploads folder
        if (event.imagePath) {
          const imagePath = path.join(__dirname, "..", event.imagePath); // Ensure correct path
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath); // Delete the file
            console.log("Image deleted:", imagePath);
          } else {
            console.log("Image not found:", imagePath);
          }
        }
    
        // Delete the event from the database
        await Event.findByIdAndDelete(event_id);
    
        res.json({ message: "Event and image deleted", event_id });
      } catch (error) {
        console.error("Error deleting event", error);
        res.status(500).json({ error: "Internal server error" });
      }
    };

const events = async (req, res) => {
      try {
          const eventList = await Event.find(); // Fetch all events
          res.status(200).json(eventList); // Send response with events
      } catch (error) {
          console.error("Error fetching events:", error);
          res.status(500).json({ message: "Internal Server Error" });
      }
  };
  
const eventDetails = async (req, res) => {
    try {
        const id = req.params.id;
        const event_details = await Event.findById(id); // Await the result

        if (!event_details) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.status(200).json(event_details);
    } catch (error) {
        console.error("Error fetching event:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = {
      event_post,
      delete_event,
      update_event, 
      events,
      eventDetails
}  