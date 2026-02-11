const router = require("express").Router();
const auth = require("../middleware/auth");
const role = require("../middleware/role");

const {
  createSalaryTemplate,
  getSalaryTemplates,
  getSalaryTemplateById,
  updateSalaryTemplate,
  deleteSalaryTemplate,
  assignTemplateToProfile,
  calculateSalaryByProfile,
} = require("../controllers/salaryTemplateController");

/* ================= SALARY TEMPLATE ================= */

// 🔥 STATIC routes FIRST
router.get("/calculate/:profileId", auth, calculateSalaryByProfile);
router.post("/assign", auth, assignTemplateToProfile);

// 🔥 Collection routes
router.get("/", auth, getSalaryTemplates);
router.post("/", auth, role(["SUPER_ADMIN","HR_ADMIN"]), createSalaryTemplate);

// 🔥 Dynamic routes LAST
router.get("/:id", auth, getSalaryTemplateById);
router.put("/:id", auth, role(["SUPER_ADMIN","HR_ADMIN"]), updateSalaryTemplate);
router.delete("/:id", auth, role(["SUPER_ADMIN","HR_ADMIN"]), deleteSalaryTemplate);

module.exports = router;
