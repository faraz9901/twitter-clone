import { Router } from 'express';
import { commentOnPost, createPost, deletePost, getAllPosts, getFollowingPosts, getUserLikedPosts, getUserPost, likeUnlikePost } from '../controllers/post.controller';

const router = Router()

router.get('/', getAllPosts)

router.post('/create', createPost)

router.get('/following', getFollowingPosts)

router.put('/comment/:id', commentOnPost)

router.put('/like/:id', likeUnlikePost)

router.get('/likes/:id', getUserLikedPosts)

router.get('/:username', getUserPost)

router.delete('/:id', deletePost)


export default router