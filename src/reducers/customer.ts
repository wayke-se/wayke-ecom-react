import { ICustomerData } from '../types';
import { UPDATE_ZIP } from '../actions/customer';

export const initialState: ICustomerData = {
    inputType: null,
    personalNumber: '',
    name: '',
    adress: '',
    zip: '',
    city: '',
    email: '',
    phone: ''
};

export const reducer = (state: ICustomerData, action): ICustomerData => {
    switch (action.type) {
        case UPDATE_ZIP:
            return {
                ...state,
                zip: action.data.zip
            };

        default:
            return state;
    };
}