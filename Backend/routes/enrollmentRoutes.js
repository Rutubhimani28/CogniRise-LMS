import { Router } from "express";
import passport from "passport";
import {
  getAllEnrollment,
  getOneEnrollment,
  addEnrollment,
  updateEnrollment,
  deleteEnrollment,
  getAllStudent,
  getEnrollCourse,
  updateCompleteTask,
  updateStatus,
  getLastEnrollment,
  countEnrollment,
  countTotalStudent,
  getGraduateTotalStudent,
  topCourse,
  viewerUser,
  usersMonth,
  compleGraduationUsers,
} from "../controllers/enrollmentController";
import Enrollment from "../models/enrollment";
import { addNotification } from "../controllers/notificationcontroller";

const router = Router();

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const enrollment = await getAllEnrollment(req.query);
      res.send(enrollment);
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
      const enrollment = await getOneEnrollment(req.params.id);
      res.send(enrollment);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.toString() });
    }
  }
);

//For get all enroll student
router.post(
  "/all",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const enrollment = await getAllStudent(req.query);
      res.send(enrollment);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.toString() });
    }
  }
);

router.post(
  "/last",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      let id = req.body.id;
      const enrollment = await getLastEnrollment(id);
      res.send(enrollment);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.toString() });
    }
  }
);

//For get all enroll course by student
router.post(
  "/getEnrollCourse",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const enrollment = await getEnrollCourse(req.body);
      res.send(enrollment);
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
      const enrollment = await countEnrollment();
      res.send({ data: enrollment });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.toString() });
    }
  }
);

router.post(
  "/student",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const enrollment = await countTotalStudent(req.body);
      res.send({ data: enrollment });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.toString() });
    }
  }
);

router.post(
  "/graduate",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const enrollment = await getGraduateTotalStudent(req.body);
      res.send({ data: enrollment });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.toString() });
    }
  }
);

router.post(
  "/topCourse",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const enrollment = await topCourse(req.body);
      res.send({ data: enrollment });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.toString() });
    }
  }
);

//Add enrollment data by student
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const result = await addEnrollment(req.body);

      //Add Notification
      if (res.status(200)) {
        const data = {
          type: "course_enroll",
          courseId: result.courseID,
          courseName: req.body.courseName,
          createdBy: result.enterpriseID,
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

//Update Complete Task
router.post(
  "/updateCompleteTask",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const result = await updateCompleteTask(req.body);
      res.send(result);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.toString() });
    }
  }
);

//Update Status
router.post(
  "/updateStatus",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const result = await updateStatus(req.body);
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
      const result = await updateEnrollment(req.body);
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
      const result = await deleteEnrollment(req.params.id);
      res.send(result);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.toString() });
    }
  }
);

//viewer users

router.post(
  "/enterprise/viewer",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      let objformanth = {};
      const allusers = await viewerUser(req.body);
      allusers.map((el) => {
        let year = el.enrollmentDate.toDateString().split(" ")[3];
        if (objformanth[year] == undefined) {
          objformanth[year] = {
            Jan: 0,
            Feb: 0,
            Mar: 0,
            Apr: 0,
            May: 0,
            Jun: 0,
            Jul: 0,
            Aug: 0,
            Sep: 0,
            Oct: 0,
            Nov: 0,
            Dec: 0,
          };
        }
        let manth = el.enrollmentDate.toDateString().split(" ")[1];
        if (objformanth[year]) {
          objformanth[year][manth] += el.completeTaskDuration;
        }
      });
      return res.send({ Totalusersinmanth: objformanth });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.toString() });
    }
  }
);

router.post(
  "/admin/viewers",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      let objformanth = {};
      const allusers = await Enrollment.find().lean().exec();
      allusers.map((el) => {
        let year = el.enrollmentDate.toDateString().split(" ")[3];
        if (objformanth[year] == undefined) {
          objformanth[year] = {
            Jan: 0,
            Feb: 0,
            Mar: 0,
            Apr: 0,
            May: 0,
            Jun: 0,
            Jul: 0,
            Aug: 0,
            Sep: 0,
            Oct: 0,
            Nov: 0,
            Dec: 0,
          };
        }
        let manth = el.enrollmentDate.toDateString().split(" ")[1];
        if (objformanth[year]) {
          objformanth[year][manth] += el.completeTaskDuration;
        }
      });
      return res.send({ Totalusersinmanth: objformanth });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.toString() });
    }
  }
);

router.post("/enterprise/completedgraduation", async (req, res) => {
  try {
    let objformanth = {};
    const allusers = await compleGraduationUsers(req.body);
    allusers.map((el) => {
      let year = el.enrollmentDate.toDateString().split(" ")[3];
      if (objformanth[year] == undefined) {
        objformanth[year] = {
          Jan: 0,
          Feb: 0,
          Mar: 0,
          Apr: 0,
          May: 0,
          Jun: 0,
          Jul: 0,
          Aug: 0,
          Sep: 0,
          Oct: 0,
          Nov: 0,
          Dec: 0,
        };
      }
      let manth = el.enrollmentDate.toDateString().split(" ")[1];
      if (objformanth[year]) {
        if (el.status == "Completed") {
          objformanth[year][manth] += 1;
        }
      }
    });
    return res.send({ Totalusersinmanth: objformanth });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.toString() });
  }
});

router.post(
  "/admin/completedgraduations",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      let objformanth = {};
      const allusers = await Enrollment.find().lean().exec();
      allusers.map((el) => {
        let year = el.enrollmentDate.toDateString().split(" ")[3];
        if (objformanth[year] == undefined) {
          objformanth[year] = {
            Jan: 0,
            Feb: 0,
            Mar: 0,
            Apr: 0,
            May: 0,
            Jun: 0,
            Jul: 0,
            Aug: 0,
            Sep: 0,
            Oct: 0,
            Nov: 0,
            Dec: 0,
          };
        }
        let manth = el.enrollmentDate.toDateString().split(" ")[1];
        if (objformanth[year]) {
          if (el.status == "Completed") {
            objformanth[year][manth] += 1;
          }
        }
      });
      return res.send({ Totalusersinmanth: objformanth });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.toString() });
    }
  }
);

router.post("/enterprise/month", async (req, res) => {
  try {
    let objformanth = {};
    const allusers = await usersMonth(req.body);
    allusers.map((el) => {
      let year = el.enrollmentDate.toDateString().split(" ")[3];
      if (objformanth[year] == undefined) {
        objformanth[year] = {
          Jan: 0,
          Feb: 0,
          Mar: 0,
          Apr: 0,
          May: 0,
          Jun: 0,
          Jul: 0,
          Aug: 0,
          Sep: 0,
          Oct: 0,
          Nov: 0,
          Dec: 0,
        };
      }
      let manth = el.enrollmentDate.toDateString().split(" ")[1];
      if (objformanth[year]) {
        objformanth[year][manth] += 1;
      }
    });
    return res.send({ Totalusersinmanth: objformanth });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.toString() });
  }
});

router.post(
  "/admin/month",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      let objformanth = {};
      const allusers = await Enrollment.find().lean().exec();
      allusers.map((el) => {
        let year = el.enrollmentDate.toDateString().split(" ")[3];
        if (objformanth[year] == undefined) {
          objformanth[year] = {
            Jan: 0,
            Feb: 0,
            Mar: 0,
            Apr: 0,
            May: 0,
            Jun: 0,
            Jul: 0,
            Aug: 0,
            Sep: 0,
            Oct: 0,
            Nov: 0,
            Dec: 0,
          };
        }
        let manth = el.enrollmentDate.toDateString().split(" ")[1];
        if (objformanth[year]) {
          objformanth[year][manth] += 1;
        }
      });
      return res.send({ Totalusersinmanth: objformanth });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.toString() });
    }
  }
);

export default router;
