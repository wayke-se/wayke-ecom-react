import { vehicles, IVehicleLookupResponse } from "@wayke-se/ecom";
import { IVehicleLookupSdkData } from "../types";
import { validateTradeIn } from "../tools/data-validation";

export const getVehicleLookup = (
    data: IVehicleLookupSdkData,
    callback: (lookup: IVehicleLookupResponse | null) => void
) => {
    const isValidRequestData = validateTradeIn(data.ecomData);

    if (!isValidRequestData) {
        return callback(null);
    }

    const request = vehicles
        .newLookupRequest()
        .withRegistrationNumber(data.ecomData.registrationNumber)
        .withMileage(parseInt(data.ecomData.milage, 10))
        .withCondition(data.ecomData.condition)
        .build();

    vehicles
        .lookupVehicle(request)
        .then((response: IVehicleLookupResponse) => {
            callback(response);
        })
        .catch(() => {
            callback(null);
        });
};
