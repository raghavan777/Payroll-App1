const EmployeeCounter = require("../models/EmployeeCounter");
const Employee = require("../models/Employee");

const generateEmployeeCode = async (dateOfJoining) => {
  try {
    let year = new Date(dateOfJoining).getFullYear();

    // 🔴 Fix invalid date
    if (!year || isNaN(year)) {
      year = new Date().getFullYear();
    }

    let isUnique = false;
    let employeeCode = "";
    let attempts = 0;

    // Retry loop to ensure uniqueness
    while (!isUnique && attempts < 10) {
      attempts++;

      const counter = await EmployeeCounter.findOneAndUpdate(
        { year },
        { $inc: { sequence: 1 } },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
        }
      );

      const seqNumber = counter?.sequence || 1;
      const seq = String(seqNumber).padStart(4, "0");
      employeeCode = `EMP-${year}-${seq}`;

      // Check if this code actually exists in Employee collection
      const existing = await Employee.findOne({ employeeCode });

      if (!existing) {
        isUnique = true;
      } else {
        console.warn(`Duplicate code generated: ${employeeCode}. Retrying...`);
      }
    }

    if (!isUnique) {
      throw new Error("Failed to generate unique employee code after multiple attempts");
    }

    return employeeCode;
  } catch (error) {
    console.error("EMP CODE ERROR:", error);

    const fallbackYear = new Date().getFullYear();
    const random = Math.floor(1000 + Math.random() * 9000);
    return `EMP-${fallbackYear}-${random}`;
  }
};

module.exports = generateEmployeeCode;
