const express = require("express");
const router = express.Router();
const controller = require('../controller/controllerEvent');
const multer = require('multer'); 

const storage = multer.diskStorage({
      destination: function (req, file, cb) {
          cb(null, 'uploads/')
      },
      filename: function (req, file, cb) {
          cb(null, file.originalname)
      }
  });
  
  const upload = multer({ storage: storage });

router.post('/event_post/:creator_id', upload.single('image'),controller.event_post);

router.put('/update_event/:event_id', upload.single('image'), controller.update_event);
router.delete('/delete_event/:event_id', controller.delete_event);
router.get('/all_events', controller.events);
router.get('/event_details/:id', controller.eventDetails);
 
 
  
module.exports = router; 