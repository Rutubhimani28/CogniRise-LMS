import { Router } from "express";
import {
  getNotification,
  updateNotification,
} from "../controllers/notificationcontroller";
import passport from "passport";

const router = Router();

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      // const notificationFor = req.body.notificationFor;
      // const enterPrise = req.body.enterPrise;
      // let notification;
      // if (enterPrise !== null) {
      //   notification = await getNotification(notificationFor, enterPrise);
      // } else if (enterPrise === null) {
      //   notification = await getNotification(notificationFor, enterPrise);
      // }
      const notification = await getNotification(req.body);
      res.send(notification);
    } catch (error) {
      return res.status(400).json({ error: error.toString() });
    }
  }
);

router.post(
  "/update",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const notification = req.body;

      let notifications = await updateNotification(notification);

      if (notification.notificationView) {
        if (notifications.notificationView.length === 0) {
          notifications.notificationView = notification.notificationView;
        } else if (notifications.notificationView.length > 0) {
          if (
            !notifications.notificationView.includes(
              notification.notificationView
            )
          ) {
            notifications.notificationView.push(notification.notificationView);
          }
        }
      }

      if (notification.clearNotification) {
        if (notifications.clearNotification.length === 0) {
          notifications.clearNotification = notification.clearNotification;
        } else if (notifications.clearNotification.length > 0) {
          if (
            !notifications.clearNotification.includes(
              notification.clearNotification
            )
          ) {
            notifications.clearNotification.push(
              notification.clearNotification
            );
          }
        }
      }
      notifications = await notifications.save();
      res.status(200).json({
        data: notifications,
        message: "Notification updated successfully...!",
      });
    } catch (error) {
      return res.status(400).json({ error: error.toString() });
    }
  }
);

router.put;
export default router;
