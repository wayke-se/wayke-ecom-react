import { IInsuranceData } from '../types';

export const initialState: IInsuranceData = {
    insuranceOption: null,
    personalNumber: '',
    expectedDrivingDistance: {
        min: null,
        max: null
    },
    alternative: ''
};

export const reducer = (state: IInsuranceData, action): IInsuranceData => {
    switch (action.type) {
        default:
            return state;
    };
}