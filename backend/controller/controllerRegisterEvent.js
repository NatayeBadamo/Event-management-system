const Register = require('../model/modelRegisterEvent');
const Event = require("../model/modelEvent");

const resgister_post = async (req, res) => {
      const user_id = req.params.user_id;
      const {nom_user, email_user, phone_user, event_id} = req.body;

      try {
            const event_register = new Register({
                  nom_user,
                  email_user,
                  phone_user,
                  event_id,
                  user_id
            });

            await event_register.save();
            res.status(200).json({"Saved: ": event_register});
      }catch (error) {
            console.error('Error saving', error);
            res.status(500).json({message: "Internal server error"});
      }

}

const getPopularEvents = async (req, res) => {
      try {
          // Count occurrences of each event_id in the Register collection
          const eventCounts = await Register.aggregate([
              {
                  $group: {
                      _id: "$event_id",
                      count: { $sum: 1 }
                  }
              },
              { $sort: { count: -1 } }, // Sort by count in descending order
              { $limit: 4 } // Get the top 4 most registered events
          ]);
  
          // Extract event IDs
          const eventIds = eventCounts.map(event => event._id);
  
          // Find the corresponding events in the Event collection
          const popularEvents = await Event.find({ _id: { $in: eventIds } });
  
          res.status(200).json(popularEvents);
      } catch (error) {
          console.error("Error fetching popular events", error);
          res.status(500).json({ message: "Internal server error" });
      }
  };

//on cherche les users id qui sont dans Register et dans Event
const user_registered_event = async (req, res) => {
    try {
        const events = await Event.find();

        const eventsWithCounts = await Promise.all(
            events.map(async (event) => {
                const registerationCount = await Register.countDocuments({event_id: event._id});
                return {...event.toObject(), registerationCount};
            })
        );

        res.json(eventsWithCounts);
    }catch(error) {
        res.status(500).json({message: "Server error", error})
    }
}

//on get tt les register event
const regisered_event = async (req, res) => {
    try {
        const register = await Register.find();

        res.json(register);
    }catch(error) {
        res.status(500).json({message: "Server error", error})
    }
}
  

module.exports = {
    resgister_post,
    getPopularEvents,
    user_registered_event,
    regisered_event
}