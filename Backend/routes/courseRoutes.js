import { Router } from "express";
import passport from "passport";
import fs from 'fs';

import {
  getAllCourse,
  getOneCourse,
  addCourse,
  updateCourse,
  deleteCourse,
  getCourseCount,
  searchCourse,
  Setlevel,
  getStudentCourse,
  deleteAllCourse,
} from "../controllers/courseController";
import { addNotification } from "../controllers/notificationcontroller";
import { uploadfile } from "../middlewares/image-uploader";

const router = Router();

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const course = await getAllCourse(req.query);
      res.send(course);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.toString() });
    }
  }
);

router.get(
  "/student",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const course = await getStudentCourse(req.query);
      res.send(course);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.toString() });
    }
  }
);

router.get(
  "/search",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const course = await searchCourse(req.query);
      res.send(course);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.toString() });
    }
  }
);

router.get(
  "/search/level",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const course = await Setlevel(req.query);
      res.send(course);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.toString() });
    }
  }
);
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const course = await getOneCourse(req.params.id);
      res.send(course);
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
      const payload = req.body;

      // Parse arrays/objects if sent as JSON string
      if (typeof payload.modules === 'string') payload.modules = JSON.parse(payload.modules);
      if (typeof payload.tags === 'string') payload.tags = JSON.parse(payload.tags);
      if (typeof payload.preRequisites === 'string') payload.preRequisites = JSON.parse(payload.preRequisites);

      // 1. Handle banner file
      if (req.files && req.files.banner) {
        const file = req.files.banner;
        const tempPath = `./public/temp/${file.name}`;
        await file.mv(tempPath);
        const uploadResult = await uploadfile(tempPath, 'course', 'image');
        payload.banner = uploadResult.secure_url;
        fs.unlinkSync(tempPath);
      }

      // 2. Handle module files (if any)
      if (payload.modules && Array.isArray(payload.modules)) {
        await Promise.all(
          payload.modules.map(async (module) => {
            await Promise.all(
              module.items.map(async (item) => {
                // If you want to support file upload for module items, use similar logic
                // Example: if (req.files[`modulefile_${item.id}`]) { ... }
              })
            );
          })
        );
      }

      const result = await addCourse(payload);

      //Send Notification
      if (res.status(200) && payload.status === "pending") {
        let data = {
          type: "course_create",
          courseId: result._id,
          courseName: result.title,
          createdBy: result.createdBy,
        };
        await addNotification(data);
      }

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
      const payload = req.body;
      if (req.files && req.files.banner) {
        const file = req.files.banner;
        const tempPath = `./public/temp/${file.name}`;

        await file.mv(tempPath);

        const uploadResult = await uploadfile(tempPath, 'course', 'image');
        payload.banner = uploadResult.secure_url;

        fs.unlinkSync(tempPath);
      }

      // 2. Handle module files
      if (payload.modules && Array.isArray(payload.modules)) {
        await Promise.all(
          payload.modules.map(async (module) => {
            await Promise.all(
              module.items.map(async (item) => {
                if (req.files && req.files[`modulefile_${item.id}`]) {
                  const file = req.files[`modulefile_${item.id}`];
                  const tempPath = `./public/temp/${file.name}`;
                  await file.mv(tempPath);
                  const uploadResult = await uploadfile(tempPath, 'course', 'file');
                  item.data.file = uploadResult.secure_url;
                  fs.unlinkSync(tempPath);
                }
              })
            );
          })
        );
      }

      const result = await updateCourse(payload);
      res.send(result);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.toString() });
    }
  }
);

router.put(
  "/update",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const payload = req.body;

      const result = await updateCourse(payload);
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
      const result = await deleteCourse(req.params.id);
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
      const result = await deleteAllCourse(req.body);
      res.send(result);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.toString() });
    }
  }
);

router.post(
  "/count",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const result = await getCourseCount(req.body);
      res.send({ data: result });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.toString() });
    }
  }
);

export default router;
