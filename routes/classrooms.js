const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/checkAuth');
const classRoomController = require('../controllers/classRoomController');
const checkTutor = require('../middleware/checkTutor');
router.post('/create',checkAuth,checkTutor,(req,res)=>{
    classRoomController.createClass(req,res);
});
router.put('/edit',checkAuth,checkTutor,(req,res)=>{
    classRoomController.editClass(req,res);
});

router.delete('/delete',checkAuth,checkTutor,(req,res)=>{
    classRoomController.deleteClass(req,res);
});

router.post('/add/student',checkAuth,checkTutor,(req,res)=>{
    classRoomController.addStudent(req,res);
});

router.delete('/remove/student',checkAuth,checkTutor,(req,res)=>{
    classRoomController.removeStudent(req,res);
});

router.get('/',checkAuth,(req,res)=>{
    classRoomController.getClassRooms(req,res);
});



module.exports = router;

