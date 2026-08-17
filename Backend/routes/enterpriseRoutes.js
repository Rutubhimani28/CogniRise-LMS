import { Router } from 'express';
import passport from 'passport';
import {
  getAllEnterprise,
  getOneEnterprise,
  addEnterprise,
  updateEnterprise,
  deleteEnterprise,
} from "../controllers/enterpriseController";

const router = Router();


router.get("/", passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const enterprise = await getAllEnterprise(req.query);
    res.send(enterprise);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.toString() });
  }
});

router.get("/:id", passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const enterprise = await getOneEnterprise(req.params.id);
    res.send(enterprise);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.toString() });
  }
});

router.post("/", passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const result = await addEnterprise(req.body);
    res.send(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.toString() });
  }
});

router.put("/", passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const result = await updateEnterprise(req.body);
    res.send(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.toString() });
  }
});

router.delete("/:id", passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const result = await deleteEnterprise(req.params.id);
    res.send(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.toString() });
  }
});

router.post("/delete-multiple", passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const { ids } = req.body; 

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'No IDs provided for deletion' });
    }

    const result = await Enterprise.deleteMany({ _id: { $in: ids } });

    res.json({ message: 'Records deleted successfully', deletedCount: result.deletedCount });
  } catch (error) {
    console.error('Delete multiple error:', error);
    return res.status(500).json({ error: error.toString() });
  }
});

export default router;
