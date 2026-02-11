const mongoose = require("mongoose");

const employeeCounterSchema = new mongoose.Schema({
  year: {
    type: Number,
    required: true,
    unique: true,
  },
  sequence: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("EmployeeCounter", employeeCounterSchema);
