import { Router } from 'express';
import passport from 'passport';
import {
  createJoinCourse
} from "../controllers/joinController";

const router = Router();

router.get("/", passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const users = await createJoinCourse();
    res.send(users);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.toString() });
  }
});

export default router;
