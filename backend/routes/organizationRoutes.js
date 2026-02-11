const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const role = require("../middleware/role");
const { getOrgDetails, updateOrgDetails } = require("../controllers/organizationController");

// 🔹 GET Org Details (ADMIN only)
router.get("/", auth, role(["SUPER_ADMIN", "HR_ADMIN"]), getOrgDetails);

// 🔹 PUT Update Org Details (SUPER_ADMIN only)
router.put("/", auth, role(["SUPER_ADMIN"]), updateOrgDetails);

module.exports = router;
