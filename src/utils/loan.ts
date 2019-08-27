export const getDurationStep = (): number => 12;
export const getDefaultDuration = (): number => 60;
export const getMinDuration = (): number => 12;
export const getMaxDuration = (): number => 72;
const base365 = 365.25 / 360; //1.013888888888889;

export const getDefaultDeposit = (price: number): number => getMinDeposit(price);
export const getMinDeposit = (price: number): number => Math.floor((price / 100) * 20);
export const getMaxDeposit = (price: number): number => (price - (price % 1000)) * 0.8;

const getTotalLoanAmount = (price: number, deposit: number): number => price - deposit;


const getResidualValue = (price: number, deposit: number, residualValuePercentage: number,): number =>
    residualValuePercentage * 0.01 * price;

const ExcelEffect = (rate: number, periods: number): number => {
    periods = parseInt('' + periods, 10);
    return Math.pow(1 + rate / periods, periods) - 1;
};

const ExcelRate = (periods: number, payment: number, present: number, future: number = 0, type: number = 0, guess: number = 0.01): number => {
    // Set maximum epsilon for end of iteration
    let epsMax = 1e-6;

    // Set maximum number of iterations
    let iterMax = 100;
    let iter = 0;
    let close = false;
    let rate = guess;

    while (iter < iterMax && !close) {
        let t1 = Math.pow(rate + 1, periods);
        let t2 = Math.pow(rate + 1, periods - 1);

        let f1 = future + t1 * present + payment * (t1 - 1) * (rate * type + 1) / rate;
        let f2 = periods * t2 * present - payment * (t1 - 1) * (rate * type + 1) / Math.pow(rate,2);
        let f3 = periods * payment * t2 * (rate * type + 1) / rate + payment * (t1 - 1) * type / rate;

        let newRate = rate - f1 / (f2 + f3);

        if (Math.abs(newRate - rate) < epsMax) close = true;
        iter++;
        rate = newRate;
    }

    if (!close) return Number.NaN + rate;
    return rate;
  };

const ExcelPMT = (rate_per_period: number, number_of_payments: number, present_value: number, future_value: number, type: number = 0): number => {
    if (rate_per_period !== 0.0) {
        // Interest rate exists
        let q = Math.pow(1 + rate_per_period, number_of_payments);
        return -(rate_per_period * (future_value + (q * present_value))) / ((-1 + q) * (1 + rate_per_period * (type)));

    } else if (number_of_payments !== 0.0) {
        // No interest rate, but number of payments exists
        return -(future_value + present_value) / number_of_payments;
    }

    return 0;
};

const totalCost = (periods: number, payment: number, startFee: number, residual: number): number => {
    let value = startFee;
    value += (periods * payment) + residual;
    return value;
};

const totalCostEffectiveRate = (periods: number, payment: number, startFee: number = 0, residual: number, effectiveRate: number): number => {
    let value = startFee;
    for (let i = 1; i <= periods; i++) {
        value += payment * (1 / Math.pow((1 + effectiveRate), (i / 12 )));
    }

    if (residual)
        value += residual * (1 / Math.pow((1 + effectiveRate), (periods / 12 )));

    return value;
};

const getMonthlyCost = (interest: number, periods: number, loan: number, residual: number, baseDuration360: boolean): number => {
    const rate_per_period = (interest / 12) * (baseDuration360 ? base365 : 1);
    return ExcelPMT(rate_per_period, periods, -loan, residual);
};

const getNominalRate = (interest: number, periods: number, loan: number, residual: number, avi: number, startFee: number, baseDuration360: boolean ): number => {
    const monthly = getMonthlyCost(interest, periods, loan, residual, baseDuration360);
    return ExcelRate(periods, -monthly - avi, loan - startFee, -residual) * 12;
};


const getEffectiveRate = (interest: number, periods: number, loan: number, residual: number, avi: number, startFee: number, baseDuration360: boolean ): number => {
    const nominalRate = getNominalRate(interest, periods, loan, residual, avi, startFee, baseDuration360);
    return ExcelEffect(nominalRate, 12);
};

const getCreditCost = (interest: number, periods: number, loan: number, residual: number, avi: number, startFee: number, baseDuration360: boolean ): number => {
    const monthly = getMonthlyCost(interest, periods, loan, residual, baseDuration360);
    const effectiveRate = getEffectiveRate(interest, periods, loan, residual, avi, startFee, baseDuration360);
    const valueTotalCost = totalCost(periods, monthly + avi, startFee, residual);
    const valueTotalCostEffectiveRate = totalCostEffectiveRate(periods, monthly + avi, startFee, residual, effectiveRate);

    return valueTotalCost - valueTotalCostEffectiveRate;
};

const getLoanAmount = (price: number, deposit: number, residualValuePercentage: number, ): number => {
    const residual = getResidualValue(price, deposit, residualValuePercentage,);
    return price - deposit - residual;
};

export const getLoanInformation = (vehiclePrice: number, duration: number, deposit: number, interest: number, administrationFee: number, setupFee: number) => {
    const residualValuePercentage = 0;
    const residual = getResidualValue(vehiclePrice, deposit, residualValuePercentage);
    const loan = (vehiclePrice - deposit);
    const interestInDecimal = interest / 100;

    const monthlyCost = getMonthlyCost(interestInDecimal, duration, loan, residual, false);
    const effectiveInterest = getEffectiveRate(interestInDecimal, duration, loan, residual, administrationFee, setupFee, false);

    const totalCreditCost = getCreditCost(interestInDecimal, duration, loan, residual, administrationFee, setupFee, false);

    return {
        monthlyCost,
        interest,
        effectiveInterest,
        setupFee,
        administrationFee,
        totalCreditCost
    };
}