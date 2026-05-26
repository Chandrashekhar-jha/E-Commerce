 const express = require('express');
const router = express.Router();
const { registerUser, LoginUser, getUsers, updateUserRole, deleteUser } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');


router.post("/register", registerUser);
router.post("/login", LoginUser);
router.get("/users", protect  , admin , getUsers);
router.put("/users/:id", protect, admin, updateUserRole);
router.delete("/users/:id", protect, admin, deleteUser);


module.exports = router;
