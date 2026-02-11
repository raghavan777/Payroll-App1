const router = require("express").Router();
const { inviteUser, acceptInvite } = require("../controllers/inviteController");
const auth = require("../middleware/auth");

router.post("/invite", auth, inviteUser);
router.post("/accept/:token", acceptInvite);

module.exports = router;
