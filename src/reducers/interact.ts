import { IInteractData } from '../types';
import { SET_INTERACTED } from '../actions/interact';

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
        case SET_INTERACTED:
            return action.data.newInteract;

        default:
            return state;
    };
}