import { orders, insurances, vehicles, IOrderOptionsResponse, IInsuranceOptionsResponse, IVehicleLookupResponse } from 'wayke-ecom';
import { IPaymentOption } from 'wayke-ecom/dist-types/orders/types';

export const getOrderOptions = (
        vehicleId: string,
        callback: (isSuccessful: boolean, options: IOrderOptionsResponse) => void
) => {
    const request = orders.newOptionsRequest()
        .forVehicle(vehicleId)
        .build();

    orders.getOptions(request)
        .then((response: IOrderOptionsResponse) => {
            callback(true, response);
        })
        .catch((e) => {
            callback(false, null);
        });
};

export const getInsuranceOptions = (
        personalNumber: string,
        vehicleId: string,
        paymentType: IPaymentOption,
        drivingDistance: number,
        callback: (isSuccessful: boolean, options: IInsuranceOptionsResponse) => void
) => {
    const request = insurances.newInsuranceOptionsRequest()
                        .forCustomer(personalNumber)
                        .forVehicle(vehicleId)
                        .withPayment(paymentType)
                        .withDrivingDistance(drivingDistance)
                        .build();

    insurances.getOptions(request)
        .then((response: IInsuranceOptionsResponse) => {
            callback(true, response);
        })
        .catch((e) => {
            callback(false, null);
        });
}

export const getVehicleLookup = (
        registrationNumber: string,
        callback: (isSuccessful: boolean, lookup: IVehicleLookupResponse) => void
) => {
    const request = vehicles.newLookupRequest()
        .withRegistrationNumber(registrationNumber)
        .build();

    vehicles.lookupVehicle(request)
        .then((response: IVehicleLookupResponse) => {
            callback(true, response);
        })
        .catch((e) => {
            callback(false, null);
        });
}