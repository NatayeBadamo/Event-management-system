const express = require('express');
const router = express.Router();
const controller = require('../controller/controllerRegisterEvent');

router.post('/register_event/:user_id', controller.resgister_post);
router.get('/trending', controller.getPopularEvents);
router.get('/count_user_register', controller.user_registered_event);
router.get('/register', controller.regisered_event);


module.exports = router;