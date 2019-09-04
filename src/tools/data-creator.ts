import { ICustomerData, ICustomerObject } from "../types";
import { IAddressLookupResponse } from '@wayke-se/ecom';
import CustomerInformationInputType from "../constants/customer-information-input-type";

export const createCustomerObject = (customer: ICustomerData, addressLookupResponse: IAddressLookupResponse | undefined): ICustomerObject => {
    const personalNumber = customer.personalNumber;
    const email = customer.email;
    const phone = customer.phone;

    var name: string, address: string, zip: string, city: string;

    const isAutomatic = customer.inputType === CustomerInformationInputType.AUTOMATIC;
    const isManual = customer.inputType === CustomerInformationInputType.MANUAL;

    if (isAutomatic && addressLookupResponse) {
        const addressLookup = addressLookupResponse.getAddress();

        name = addressLookup.name;
        address = addressLookup.street;
        zip = addressLookup.postalCode;
        city = addressLookup.city;
    } else if (isManual) {
        name = customer.name;
        address = customer.address;
        zip = customer.zip;
        city = customer.city;
    }

    return {
        isMasked: isAutomatic,
        isAutomaticLookup: isAutomatic,
        personalNumber,
        email,
        phone,
        // @ts-ignore
        name,
        // @ts-ignore
        address,
        // @ts-ignore
        zip,
        // @ts-ignore
        city
    };
}