import { insurances, IInsuranceOptionsResponse } from 'wayke-ecom';
import { IInsuranceData, IInsuranceOptionsSdkData } from '../types';
import { validateInsurance } from '../tools/data-validation';

const validate = (data: IInsuranceData) => {
    //Data should already be validated, but this is a safety measure

    return validateInsurance(data);
}

export const getInsuranceOptions = (data: IInsuranceOptionsSdkData, callback: (options: IInsuranceOptionsResponse) => void) => {
    const isValidRequestData = validate(data.ecomData);

    if (!isValidRequestData) {
        return callback(null);
    }

    const request = insurances.newInsuranceOptionsRequest()
                        .forCustomer(data.ecomData.personalNumber)
                        .forVehicle(data.vehicleId)
                        .withPaymentType(data.paymentType)
                        .withDrivingDistance(data.ecomData.expectedDrivingDistance)
                        .build();

    insurances.getOptions(request)
        .then((response: IInsuranceOptionsResponse) => {
            callback(response);
        })
        .catch(() => {
            callback(null);
        });
};