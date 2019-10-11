const express = require('express');
const router = express.Router();

const goal_controller = require('../controllers/userline.controller');

//router.get('/userline', misc_controller.login); //navigates to login page
router.get('/userline', (req, res) => {
	res.render('./userline.ejs')
}); //navigates back to log in menu


module.exports = router;