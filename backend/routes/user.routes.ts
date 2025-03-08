import { Router } from "express";
import { followUser, getSuggestedUsers, getUserProfile, updateUser } from "../controllers/user.controller";
import { upload } from "../utils/uploadToMulter";

const router = Router();

router.get('/profile/:username', getUserProfile)
router.get('/suggested-users', getSuggestedUsers)
router.post('/follow/:username', followUser)
router.put('/update-profile',
    upload.fields([
        { name: 'profileImg', maxCount: 1 },
        { name: 'coverImg', maxCount: 1 }
    ]), updateUser)

export default router