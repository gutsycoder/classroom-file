const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/checkAuth');
const classRoomController = require('../controllers/classRoomController');
router.post('/create',checkAuth,(req,res)=>{
    classRoomController.createClass(req,res);
});


module.exports = router;

