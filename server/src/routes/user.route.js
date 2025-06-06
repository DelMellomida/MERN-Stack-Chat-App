import express from "express";
import {getAllUsers, editProfile, addFriend, removeFriend} from "../controllers/user.controller.js";
import {protectRoute} from "../middleware/auth.middleware.js";

const router = express.Router();

router.get('/all-users', protectRoute, getAllUsers);

router.post('/edit-profile', protectRoute, editProfile);
router.post('/add-friend', protectRoute, addFriend);
router.post('/remove-friend', protectRoute, removeFriend);

export default router;