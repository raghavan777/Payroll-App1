/**
 * Calculate overtime hours and pay
 */
exports.calculateOvertime = (attendanceRecords, hourlyRate) => {
  let overtimeHours = 0;

  attendanceRecords.forEach((record) => {
    if (record.status !== "PRESENT") return;

    const extraHours = record.hoursWorked - 8;
    if (extraHours > 0) {
      overtimeHours += extraHours;
    }
  });

  return {
    overtimeHours: Number(overtimeHours.toFixed(2)),
    overtimePay: Number((overtimeHours * hourlyRate).toFixed(2)),
  };
};
