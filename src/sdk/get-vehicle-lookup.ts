import { vehicles, IVehicleLookupResponse, } from 'wayke-ecom';
import { ITradeInCarData, IVehicleLookupSdkData } from '../types';
import { validateTradeIn } from '../tools/data-validation';

const validate = (data: ITradeInCarData) => {
    //Data should already be validated, but this is a safety measure

    return validateTradeIn(data);
}

export const getVehicleLookup = (data: IVehicleLookupSdkData, callback: (lookup: IVehicleLookupResponse) => void) => {
    const isValidRequestData = validate(data.ecomData);

    if (!isValidRequestData) {
        return callback(null);
    }

    const request = vehicles.newLookupRequest()
        .withRegistrationNumber(data.ecomData.registrationNumber)
        .build();

    vehicles.lookupVehicle(request)
        .then((response: IVehicleLookupResponse) => {
            callback(response);
        })
        .catch(() => {
            callback(null);
        });
};