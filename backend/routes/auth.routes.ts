import { Router } from "express";
import { getUser, signin, signout, signup } from "../controllers/auth.controllers";
import forLoggedInUsers from "../middleware/forLoggedInUsers";


const router = Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/signout', signout);

router.get('/user', forLoggedInUsers, getUser)

export default router;