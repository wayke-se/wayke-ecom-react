import { ICustomerData, ICustomerObject } from "../types";
import { IAddressLookupResponse } from "wayke-ecom";

export const createCustomerObject = (customer: ICustomerData, addressLookupResponse: IAddressLookupResponse | undefined): ICustomerObject => {
    const personalNumber = customer.personalNumber;
    const email = customer.email;
    const phone = customer.phone;

    var name: string, address: string, zip: string, city: string;

    if (addressLookupResponse) {
        const addressLookup = addressLookupResponse.getAddress();

        name = addressLookup.name;
        address = addressLookup.street;
        zip = addressLookup.postalCode;
        city = addressLookup.city;
    } else {
        name = customer.name;
        address = customer.address;
        zip = customer.zip;
        city = customer.city;
    }

    return {
        isMasked: !!addressLookupResponse,
        isAutomaticLookup: !!addressLookupResponse,
        personalNumber,
        email,
        phone,
        name,
        address,
        zip,
        city
    };
}