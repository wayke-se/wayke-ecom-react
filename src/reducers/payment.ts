import { IPaymentData } from '../types';

export const initialState: IPaymentData = {
    method: null,
    financingDownPayment: '',
    financingDuration: null
};

export const reducer = (state: IPaymentData, action): IPaymentData => {
    switch (action.type) {
        default:
            return state;
    };
}