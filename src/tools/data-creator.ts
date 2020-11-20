import { ICustomerData, ICustomerObject } from "../types";
import { IAddress } from "@wayke-se/ecom";
import CustomerInformationInputType from "../constants/customer-information-input-type";

export const createCustomerObject = (
    customer: ICustomerData,
    address: IAddress | undefined
): ICustomerObject => {
    const { personalNumber, email, phone, givenName, surname } = customer;
    let { name, zip, city, street } = customer;

    const isAutomatic =
        customer.inputType === CustomerInformationInputType.AUTOMATIC;

    if (address) {
        name = address.name;
        street = address.street;
        zip = address.postalCode;
        city = address.city;
    }

    return {
        personalNumber,
        email,
        phone,
        name,
        givenName,
        surname,
        street,
        zip,
        city,
        isMasked: isAutomatic,
        isAutomaticLookup: isAutomatic,
    };
};
