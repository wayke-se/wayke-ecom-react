import { ICustomerData } from '../types';
import { UPDATE_INPUT_TYPE, UPDATE_PERSONAL_NUMBER, UPDATE_NAMED_STRING_ATTRIBUTE } from '../actions/customer';

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
        case UPDATE_INPUT_TYPE:
            return {
                ...state,
                inputType: action.data.inputType
            };

        case UPDATE_PERSONAL_NUMBER:
            return {
                ...state,
                personalNumber: action.data.personalNumber
            };

        case UPDATE_NAMED_STRING_ATTRIBUTE:
            const name = action.data.name;
            const hasNoSuchAttribute = !Object.keys(initialState).includes(name);

            if (hasNoSuchAttribute) {
                throw 'No customer atribute found with name: ' + name;
            }

            return {
                ...state,
                [name]: action.data.value
            }

        default:
            return state;
    };
}