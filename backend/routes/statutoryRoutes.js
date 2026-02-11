const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const role = require("../middleware/role");

const {
    getStatutoryConfigs,
    addStatutoryConfig,
    updateStatutoryConfig,
    deleteStatutoryConfig
} = require("../controllers/statutoryController");

// 🔹 GET all Statutory Configs (All authenticated users can see, or restrict to ADMIN)
router.get("/", auth, getStatutoryConfigs);

// 🔹 POST Add Statutory Config (SUPER_ADMIN only)
router.post("/", auth, role(["SUPER_ADMIN"]), addStatutoryConfig);

// 🔹 PUT Update Statutory Config (SUPER_ADMIN only)
router.put("/:id", auth, role(["SUPER_ADMIN"]), updateStatutoryConfig);

// 🔹 DELETE Statutory Config (SUPER_ADMIN only)
router.delete("/:id", auth, role(["SUPER_ADMIN"]), deleteStatutoryConfig);

module.exports = router;
