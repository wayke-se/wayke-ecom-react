import { ICustomerData, ICustomerObject } from "../types";
import { IAddressLookupResponse } from "@wayke-se/ecom";
import CustomerInformationInputType from "../constants/customer-information-input-type";

export const createCustomerObject = (
    customer: ICustomerData,
    addressLookupResponse: IAddressLookupResponse | undefined
): ICustomerObject => {
    const { personalNumber, email, phone } = customer;
    let { name, address, zip, city } = customer;

    const isAutomatic =
        customer.inputType === CustomerInformationInputType.AUTOMATIC;

    if (isAutomatic && addressLookupResponse) {
        const addressLookup = addressLookupResponse.getAddress();

        name = addressLookup.name;
        address = addressLookup.street;
        zip = addressLookup.postalCode;
        city = addressLookup.city;
    }

    return {
        personalNumber,
        email,
        phone,
        name,
        address,
        zip,
        city,
        isMasked: isAutomatic,
        isAutomaticLookup: isAutomatic,
    };
};
