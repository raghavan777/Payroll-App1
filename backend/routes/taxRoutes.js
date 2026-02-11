const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const verifyToken = require("../middleware/verifyToken");
const authorizeRoles = require("../middleware/authorizeRoles");
const {
  createOrUpdateTaxSlabs,
  listTaxDeclarations,
  createTaxDeclaration,
  updateTaxDeclaration,
  getMyDeclaration,
  getTaxProjection,
  downloadTaxStatement,
} = require("../controllers/taxManagementController");

const router = express.Router();

const PROOF_DIR = path.join(__dirname, "..", "uploads", "tax");
if (!fs.existsSync(PROOF_DIR)) {
  fs.mkdirSync(PROOF_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, PROOF_DIR),
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, `${Date.now()}-${safeName}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file
});

// SUPER_ADMIN: create/update slab set for a regime + financial year.
router.post(
  "/slabs",
  verifyToken,
  authorizeRoles("SUPER_ADMIN"),
  createOrUpdateTaxSlabs
);

// SUPER_ADMIN: view declarations for all employees in organization.
router.get(
  "/declarations",
  verifyToken,
  authorizeRoles("SUPER_ADMIN"),
  listTaxDeclarations
);

// SUPER_ADMIN: create employee tax declaration with optional proof files.
router.post(
  "/declarations",
  verifyToken,
  authorizeRoles("SUPER_ADMIN"),
  upload.array("proofFiles", 10),
  createTaxDeclaration
);

// SUPER_ADMIN: update an existing declaration.
router.put(
  "/declarations/:id",
  verifyToken,
  authorizeRoles("SUPER_ADMIN"),
  upload.array("proofFiles", 10),
  updateTaxDeclaration
);

// EMPLOYEE: fetch only own declaration.
router.get(
  "/my-declaration",
  verifyToken,
  authorizeRoles("EMPLOYEE"),
  getMyDeclaration
);

// EMPLOYEE: projected annual tax from salary profile + chosen/default regime.
router.get(
  "/projection",
  verifyToken,
  authorizeRoles("EMPLOYEE"),
  getTaxProjection
);

// EMPLOYEE: download own tax statement PDF.
router.get(
  "/download/:id",
  verifyToken,
  authorizeRoles("EMPLOYEE"),
  downloadTaxStatement
);

module.exports = router;
