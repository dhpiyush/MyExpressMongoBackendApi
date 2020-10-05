const express = require('express');
const authController = require('../controllers/auth');
const userController = require('../controllers/user');

const router = express.Router();

/**
    * get a user
    */
// router.get('/:id', test);

/**
    * get a user profile
    */
// router.get('/profile/:id', test);

/**
    * adds a user
    */
// router.post('/add', test)

router.post('/resetPassword/:token', authController.resetPassword); // receive token as well as new password

router.use(authController.protect);
router.post('/updatePassword', authController.updatePassword); //user must be loggedin

// router.patch('/updateMyPaswword', authController.updatePassword);
router.post('/profile/update/me', userController.updateMe, userController.updateUser);
// router.delete('/deleteMe', userController.deleteMe);
router.get('/profile/me', userController.getMe, userController.getUser);
router.get('/all', authController.restrictTo('admin'), userController.getAllUsers);
    
module.exports = router;



