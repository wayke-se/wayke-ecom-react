import { ICustomerData, ICustomerObject } from "../types";
import { IAddress } from "@wayke-se/ecom";
import CustomerInformationInputType from "../constants/customer-information-input-type";

export const createCustomerObject = (
    customer: ICustomerData,
    address: IAddress | undefined
): ICustomerObject => {
    const { personalNumber, email, phone } = customer;
    let { zip, city, street, givenName, surname } = customer;

    const isAutomatic =
        customer.inputType === CustomerInformationInputType.AUTOMATIC;

    if (address) {
        street = address.street;
        zip = address.postalCode;
        city = address.city;
        givenName = address.givenName;
        surname = address.surname;
    }

    return {
        personalNumber,
        email,
        phone,
        givenName,
        surname,
        street,
        zip,
        city,
        isMasked: isAutomatic,
        isAutomaticLookup: isAutomatic,
    };
};
