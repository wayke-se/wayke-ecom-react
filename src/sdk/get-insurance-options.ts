import { insurances, IInsuranceOptionsResponse } from "@wayke-se/ecom";
import { IInsuranceOptionsSdkData } from "../types";
import { validateInsurance } from "../tools/data-validation";

export const getInsuranceOptions = (
    data: IInsuranceOptionsSdkData,
    callback: (options: IInsuranceOptionsResponse | null) => void
) => {
    const isValidRequestData = validateInsurance(data.ecomData);

    if (!isValidRequestData) {
        return callback(null);
    }

    const request = insurances
        .newInsuranceOptionsRequest()
        .forCustomer(data.ecomData.personalNumber)
        .forVehicle(data.vehicleId)
        .withPaymentType(data.paymentType)
        .withDrivingDistance(data.ecomData.expectedDrivingDistance)
        .build();

    insurances
        .getOptions(request)
        .then((response: IInsuranceOptionsResponse) => {
            callback(response);
        })
        .catch(() => {
            callback(null);
        });
};
