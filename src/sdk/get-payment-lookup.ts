import { payments, IPaymentLookupResponse, IOrderOptionsResponse } from '@wayke-se/ecom';
import { IPaymentLookupSdkData, IPaymentData } from '../types';
import { validatePayment } from '../tools/data-validation';

const validate = (data: IPaymentData, orderOptions: IOrderOptionsResponse, paymentLookup: IPaymentLookupResponse | undefined) => {
    //Data should already be validated, but this is a safety measure

    return validatePayment(data, orderOptions, paymentLookup);
}

export const getPaymentLookup = (data: IPaymentLookupSdkData, callback: (lookup: IPaymentLookupResponse | null) => void) => {
    const isValidRequestData = validate(data.ecomData, data.orderOptions, data.paymentLookup);

    if (!isValidRequestData) {
        return callback(null);
    }

    const builder = payments.newLookupRequest()
        .forVehicle(data.vehicleId)
        .withDownPayment(data.ecomData.loanDeposit)
        .withDuration(data.ecomData.loanDuration);

    const hasResidual = data.ecomData.loanResidual !== null;

    if (hasResidual) {
        builder.withResidualValue(data.ecomData.loanResidual);
    }

    const request = builder.build();

    payments.lookupPayment(request)
        .then((response: IPaymentLookupResponse) => {
            callback(response);
        })
        .catch(() => {
            callback(null);
        });
};