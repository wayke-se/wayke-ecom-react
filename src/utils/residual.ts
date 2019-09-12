import { IPaymentRangeSpec } from '@wayke-se/ecom';

export const isResidualEnabled = (residualSpecification: IPaymentRangeSpec): boolean => {
    if (!residualSpecification) {
        return;
    }

    return residualSpecification.min !== residualSpecification.max;
}

export const getConvertedResidualSpecification = (residualSpecification: IPaymentRangeSpec): IPaymentRangeSpec => {
    const hasResidual = isResidualEnabled(residualSpecification);

    if (hasResidual) {
        return {
            min: residualSpecification.min * 100,
            max: residualSpecification.max * 100,
            step: residualSpecification.step * 100,
            default: residualSpecification.default * 100,
            current: 0
        } as IPaymentRangeSpec;
    } else {
        return null;
    }
}