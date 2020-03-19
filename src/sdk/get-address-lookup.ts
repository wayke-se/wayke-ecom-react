import { customers, IAddressLookupResponse } from "@wayke-se/ecom";
import { ICustomerData, IAddressLookupSdkData } from "../types";
import { validateCustomerObjectPersonalNumber } from "../tools/data-validation";
import { createCustomerObject } from "../tools/data-creator";

const validate = (data: ICustomerData) => {
    // Data should already be validated, but this is a safety measure

    const customerObject = createCustomerObject(data, null);
    return validateCustomerObjectPersonalNumber(customerObject);
};

export const getAddressLookup = (
    data: IAddressLookupSdkData,
    callback: (lookup: IAddressLookupResponse | null) => void
) => {
    const isValidRequestData = validate(data.ecomData);

    if (!isValidRequestData) {
        return callback(null);
    }

    const request = customers
        .newAddressLookupRequest()
        .forCustomer(data.ecomData.personalNumber)
        .build();

    customers
        .lookupAddress(request)
        .then((response: IAddressLookupResponse) => {
            callback(response);
        })
        .catch(() => {
            callback(null);
        });
};
