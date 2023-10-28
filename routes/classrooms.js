const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/checkAuth');
const classRoomController = require('../controllers/classRoomController');
router.post('/create',checkAuth,(req,res)=>{
    classRoomController.createClass(req,res);
});
router.put('/edit',checkAuth,(req,res)=>{
    classRoomController.editClass(req,res);
});

router.delete('/delete',checkAuth,(req,res)=>{
    classRoomController.deleteClass(req,res);
});

router.post('/add/student',checkAuth,(req,res)=>{
    classRoomController.addStudent(req,res);
})
router.delete('/remove/student',checkAuth,(req,res)=>{
    classRoomController.removeStudent(req,res);
})

module.exports = router;

