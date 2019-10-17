import { IOrderOptionsResponse } from "@wayke-se/ecom"
import { IRetailerInformation } from "../types";

export const getRetailerInformation = (orderOptions: IOrderOptionsResponse): IRetailerInformation => {
    const contactInformation = orderOptions ? orderOptions.getContactInformation() : null;

    if (contactInformation) {
        return {
            name: contactInformation.name || '',
            email: contactInformation.email || '',
            phoneNumber: contactInformation.phone || ''
        };
    } else {
        return {
            name: '',
            email: '',
            phoneNumber: ''
        };
    }
};