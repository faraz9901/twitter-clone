import { Router } from "express";
import { deleteAllNotifications, deleteNotification, getNotifications, markAsNotificationRead } from "../controllers/notification.controller";


const router = Router()


router.route("/")
    .get(getNotifications)
    .delete(deleteAllNotifications)


router.route("/:id")
    .put(markAsNotificationRead)
    .delete(deleteNotification)



export default router