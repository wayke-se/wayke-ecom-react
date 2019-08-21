import { IDeliveryData } from '../types';
import { UPDATE_TYPE } from '../actions/delivery';

export const initialState: IDeliveryData = {
    type: null
};

export const reducer = (state: IDeliveryData, action): IDeliveryData => {
    switch (action.type) {
        case UPDATE_TYPE:
            return {
                ...state,
                type: action.data.type
            }

        default:
            return state;
    };
}