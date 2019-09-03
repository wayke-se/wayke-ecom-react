import { payments, IPaymentLookupResponse } from 'wayke-ecom';
import { IPaymentLookupSdkData, IPaymentData } from '../types';
import { validatePayment } from '../tools/data-validation';

const validate = (data: IPaymentData) => {
    //Data should already be validated, but this is a safety measure

    return validatePayment(data);
}

export const getPaymentLookup = (data: IPaymentLookupSdkData, callback: (lookup: IPaymentLookupResponse) => void) => {
    const isValidRequestData = validate(data.ecomData);

    if (!isValidRequestData) {
        return callback(null);
    }

    const request = payments.newLookupRequest()
        .forVehicle(data.vehicleId)
        .withDownPayment(data.ecomData.loanDeposit)
        .withDuration(data.ecomData.loanDuration)
        .withResidualValue(data.ecomData.loanResidual)
        .build();

    payments.lookupPayment(request)
        .then((response: IPaymentLookupResponse) => {
            callback(response);
        })
        .catch(() => {
            callback(null);
        });
};