import { Router } from "express";
import passport from "passport";
import {
  getAllCourseCat,
  getOneCourseCat,
  addCourseCat,
  updateCourseCat,
  deleteCourseCat,
  deleteManyCat,
} from "../controllers/courseCatController";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const courseCat = await getAllCourseCat(req.query);
    res.send(courseCat);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.toString() });
  }
});

router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const courseCat = await getOneCourseCat(req.params.id);
      res.send(courseCat);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.toString() });
    }
  }
);

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const result = await addCourseCat(req.body);
      res.send(result);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.toString() });
    }
  }
);

router.put(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const result = await updateCourseCat(req.body);
      res.send(result);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.toString() });
    }
  }
);

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const result = await deleteCourseCat(req.params.id);
      res.send(result);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.toString() });
    }
  }
);

router.post(
  "/delete-many",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const result = await deleteManyCat(req.body);
      res.send(result);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.toString() });
    }
  }
);

export default router;
