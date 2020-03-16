import { IPaymentRangeSpec } from "@wayke-se/ecom";

export const isResidualEnabled = (
    residualSpecification: IPaymentRangeSpec
): boolean => {
    if (!residualSpecification) {
        return false;
    }

    return residualSpecification.min !== residualSpecification.max;
};

export const isResidualFixed = (
    residualSpecification: IPaymentRangeSpec
): boolean => {
    if (!residualSpecification) {
        return false;
    }

    return (
        residualSpecification.min > 0 &&
        residualSpecification.min === residualSpecification.max
    );
};

const removeDecimalError = (value: number): number => {
    return parseFloat(value.toFixed(8));
};

export const getConvertedResidualSpecification = (
    residualSpecification: IPaymentRangeSpec
): IPaymentRangeSpec => {
    if (!residualSpecification) {
        return null;
    }

    return {
        min: removeDecimalError(residualSpecification.min * 100),
        max: removeDecimalError(residualSpecification.max * 100),
        step: removeDecimalError(residualSpecification.step * 100),
        default: removeDecimalError(residualSpecification.default * 100),
        current: 0,
    };
};
