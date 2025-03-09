import { Router } from 'express';
import { commentOnPost, createPost, deletePost, getAllPosts, getFollowingPosts, getUserLikedPosts, getUserPosts, likeUnlikePost } from '../controllers/post.controller';
import { upload } from '../utils/uploadToMulter';

const router = Router()

router.get('/', getAllPosts)

router.post('/create', upload.single('image'), createPost)

router.get('/following', getFollowingPosts)

router.put('/comment/:id', commentOnPost)

router.put('/like/:id', likeUnlikePost)

router.get('/likes/:id', getUserLikedPosts)

router.get('/:username', getUserPosts)

router.delete('/:id', deletePost)


export default router