module.exports = function calculateSalaryFromCTC(ctc, template) {
  const basic = (template.earnings.basicPercent / 100) * ctc;
  const hra = (template.earnings.hraPercent / 100) * ctc;
  const allowances = (template.earnings.allowancesPercent / 100) * ctc;

  const gross = basic + hra + allowances;

  const pf = (template.deductions.pfPercent / 100) * basic;
  const esi = (template.deductions.esiPercent / 100) * gross;
  const tax = (template.deductions.taxPercent / 100) * gross;

  const totalDeductions = pf + esi + tax;
  const net = gross - totalDeductions;

  return {
    grossSalary: gross,
    basic,
    hra,
    allowances,
    deductions: {
      pf,
      esi,
      tax,
      total: totalDeductions
    },
    netSalary: net
  };
};
