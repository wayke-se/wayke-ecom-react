import { ILoanSpecification } from "../types";

export default (vehiclePrice: number): ILoanSpecification => {
    const depositMin = Math.floor((vehiclePrice / 100) * 20);

    return {
        durationMin: 12,
        durationMax: 72,
        durationStep: 12,
        durationDefault: 60,

        depositMin,
        depositMax: (vehiclePrice - (vehiclePrice % 1000)) * 0.8,
        depositStep: 10,
        depositDefault: depositMin,

        residualMin: 10,
        residualMax: 90,
        residualDefault: 20,
        residualStep: 10
    };
};