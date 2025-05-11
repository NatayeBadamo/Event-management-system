const express = require("express");
const router = express.Router();
const controller = require("../controller/controllerUser");
const middleware = require("../middleware/middleware");


router.post('/signin', controller.signin);
router.post('/login', controller.login);
router.get('/requireAuth', middleware.requireAuth);
router.get('/checkUser', middleware.checkUser);

router.get('/logout', controller.logout);
module.exports = router;