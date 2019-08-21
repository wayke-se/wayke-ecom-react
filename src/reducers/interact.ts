import { IInteractData } from '../types';

export const initialState: IInteractData = {
    tradeInCar: {
        registrationNumber: false,
        milage: false,
    },

    insurance: {
        personalNumber: false,
    },

    context: {
        hasAcceptedTerms: false,
    },

    customer: {
        personalNumber: false,
        name: false,
        adress: false,
        zip: false,
        city: false,
        email: false,
        phone: false,
    }
};

export const reducer = (state: IInteractData, action): IInteractData => {
    switch (action.type) {
        default:
            return state;
    };
}