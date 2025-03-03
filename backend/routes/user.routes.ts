import { Router } from "express";
import { followUser, getSuggestedUsers, getUserProfile, updateUser } from "../controllers/user.controller";

const router = Router();

router.get('/profile/:username', getUserProfile)
router.get('/suggested-users', getSuggestedUsers)
router.post('/follow/:username', followUser)
router.put('/update-profile', updateUser)

export default router