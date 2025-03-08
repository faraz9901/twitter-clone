import { Router } from 'express';
import { commentOnPost, createPost, deletePost, getAllPosts, getFollowingPosts, getUserLikedPosts, getUserPost, likeUnlikePost } from '../controllers/post.controller';
import multer from 'multer';
import path from 'path';

const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            const filePath = path.join(__dirname, '..', 'uploads')
            cb(null, filePath)
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + '-' + file.originalname)
        }
    })
})

const router = Router()

router.get('/', getAllPosts)

router.post('/create', upload.single('image'), createPost)

router.get('/following', getFollowingPosts)

router.put('/comment/:id', commentOnPost)

router.put('/like/:id', likeUnlikePost)

router.get('/likes/:id', getUserLikedPosts)

router.get('/:username', getUserPost)

router.delete('/:id', deletePost)


export default router