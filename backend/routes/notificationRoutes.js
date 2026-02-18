const router = require("express").Router();
const auth = require("../middleware/auth");
const ctrl = require("../controllers/notificationController");

router.get("/", auth, ctrl.getMyNotifications);
router.put("/read/:id", auth, ctrl.markAsRead);
router.put("/read-all", auth, ctrl.markAllAsRead);
router.delete("/clear", auth, ctrl.clearAll);

module.exports = router;
