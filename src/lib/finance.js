function annualToMonthlyRate(annualRate) {
  return Math.pow(1 + annualRate, 1 / 12) - 1;
}

function monthlyToAnnualRate(monthlyRate) {
  return Math.pow(1 + monthlyRate, 12) - 1;
}

function pricePMT(pv, i, n) {
  if (n <= 0) return 0;
  if (Math.abs(i) < 1e-9) return pv / n;
  const factor = Math.pow(1 + i, n);
  return pv * (i * factor) / (factor - 1);
}

function futureValue(pv, pmt, i, n) {
  if (Math.abs(i) < 1e-9) {
    return pv + pmt * n;
  }
  const factor = Math.pow(1 + i, n);
  return pv * factor + pmt * ((factor - 1) / i);
}

function npv(rate, cashflows) {
    let sum = 0;
    for (let i = 0; i < cashflows.length; i++) {
        sum += cashflows[i] / Math.pow(1 + rate, i);
    }
    return sum;
}

function npvDerivative(rate, cashflows) {
    let d = 0;
    for (let i = 1; i < cashflows.length; i++) {
        d -= (i * cashflows[i]) / Math.pow(1 + rate, i + 1);
    }
    return d;
}

function irrMonthly(cashflows, guess = 0.005) {
    const MAX_ITER_NEWTON = 50;
    const MAX_ITER_BISECTION = 100;
    const TOLERANCE = 1e-10;

    let x0 = guess;

    for (let i = 0; i < MAX_ITER_NEWTON; i++) {
        const fValue = npv(x0, cashflows);
        const fDerivative = npvDerivative(x0, cashflows);
        
        if (Math.abs(fDerivative) < 1e-15) break;

        const x1 = x0 - fValue / fDerivative;
        if (Math.abs(x1 - x0) < TOLERANCE) return x1;
        x0 = x1;
    }

    let low = -0.99;
    let high = 1.0; 
    let mid;

    for (let i = 0; i < MAX_ITER_BISECTION; i++) {
        mid = (low + high) / 2;
        let fMid = npv(mid, cashflows);

        if (Math.abs(fMid) < TOLERANCE) {
            return mid;
        }

        if (npv(low, cashflows) * fMid < 0) {
            high = mid;
        } else {
            low = mid;
        }
    }
    
    return mid;
}

function buildSchedulePRICE({ PV, i, n, monthlyFee = 0, insurancePctOnBalance = 0 }) {
  const pmtBase = pricePMT(PV, i, n);
  const rows = [];
  let balance = PV;
  let totalPaid = 0;
  let totalInterest = 0;

  for (let k = 1; k <= n; k++) {
    const interest = balance * i;
    const insurance = balance * insurancePctOnBalance;
    let amortization = pmtBase - interest;
    
    if (balance - amortization < 0.01) {
        amortization = balance;
    }

    const installment = pmtBase + monthlyFee + insurance;
    balance -= amortization;
    
    totalPaid += installment;
    totalInterest += interest;

    if (k <= 12) {
      rows.push({
        mes: k,
        parcela: installment,
        juros: interest,
        amort: amortization,
        saldo: Math.max(0, balance)
      });
    }
  }
  return { rows, totalPaid, totalInterest };
}

function buildScheduleSAC({ PV, i, n, monthlyFee = 0, insurancePctOnBalance = 0 }) {
  const amortization = PV / n;
  const rows = [];
  let balance = PV;
  let totalPaid = 0;
  let totalInterest = 0;

  for (let k = 1; k <= n; k++) {
    const interest = balance * i;
    const insurance = balance * insurancePctOnBalance;
    const installment = amortization + interest + monthlyFee + insurance;
    
    balance -= amortization;
    totalPaid += installment;
    totalInterest += interest;
    
    if (k <= 12) {
      rows.push({
        mes: k,
        parcela: installment,
        juros: interest,
        amort: amortization,
        saldo: Math.max(0, balance)
      });
    }
  }
  return { rows, totalPaid, totalInterest };
}

function buildCashflows({ PV, i, n, system, fees, cashAtT0FromLender }) {
  const PVeff = PV + (fees.financed || 0);
  const receiveAt0 = typeof cashAtT0FromLender === 'number' ? cashAtT0FromLender : PV;
  const upfront = fees.upfront || 0;

  const cashflows = [- (PVeff - upfront)];

  let balance = PVeff;
  
  if (system === 'SAC') {
    const amortization = PVeff / n;
    for (let k = 1; k <= n; k++) {
      const interest = balance * i;
      const insurance = balance * (fees.insurancePctOnBalance || 0);
      const installment = amortization + interest + (fees.monthly || 0) + insurance;
      cashflows.push(installment);
      balance -= amortization;
    }
  } else {
    const pmtBase = pricePMT(PVeff, i, n);
    for (let k = 1; k <= n; k++) {
      const interest = balance * i;
      const insurance = balance * (fees.insurancePctOnBalance || 0);
      const installment = pmtBase + (fees.monthly || 0) + insurance;
      cashflows.push(installment);
      balance -= (pmtBase - interest);
    }
  }

  const irrFlows = [receiveAt0 - upfront, ...cashflows.slice(1).map(v => -v)];

  const scheduleBuilder = system === 'SAC' ? buildScheduleSAC : buildSchedulePRICE;
  const scheduleParams = { 
      PV: PVeff, 
      i, 
      n, 
      monthlyFee: fees.monthly || 0, 
      insurancePctOnBalance: fees.insurancePctOnBalance || 0 
  };
  const schedule = scheduleBuilder(scheduleParams);

  const totalPaid = cashflows.slice(1).reduce((acc, val) => acc + val, 0);
  const totalInterestAndFees = totalPaid - PV;

  schedule.totalPaid = totalPaid;
  schedule.totalInterestAndFees = totalInterestAndFees;
  
  return { cashflows: irrFlows, schedule };
}

function computeCET({
  principal,
  rateAnual,
  nMeses,
  sistema,
  fees = {}
}) {
  const i = annualToMonthlyRate(rateAnual);
  const PVeff = principal + (fees.financed || 0);

  const { cashflows, schedule } = buildCashflows({
    PV: principal,
    i, n: nMeses,
    system: sistema,
    fees,
  });
  
  try {
    const cetMensal = irrMonthly(cashflows);
    if (!isFinite(cetMensal) || cetMensal < -0.99) {
        throw new Error('Cálculo do CET resultou em valor inválido. Verifique os parâmetros.');
    }
    const cetAnual = monthlyToAnnualRate(cetMensal);

    return {
      cetMensal,
      cetAnual,
      totalPago: schedule.totalPaid,
      totalJuros: schedule.totalInterestAndFees,
      preview: schedule.rows,
    };
  } catch (error) {
    console.error("Erro no cálculo do CET:", error.message);
    return {
      error: "Não foi possível calcular o CET. Verifique os valores, especialmente as taxas, para garantir que o custo não exceda o valor financiado.",
      cetMensal: NaN,
      cetAnual: NaN,
      totalPago: NaN,
      totalJuros: NaN,
      preview: [],
    };
  }
}

export {
    computeCET,
    annualToMonthlyRate,
    futureValue
};