import { ITradeInCarData } from '../types';

export const initialState: ITradeInCarData = {
    hasTradeInCar: null,
    registrationNumber: '',
    milage: ''
};

export const reducer = (state: ITradeInCarData, action): ITradeInCarData => {
    switch (action.type) {
        default:
            return state;
    };
}