import { IEcomContext } from '../types';
import { UPDATE_HAS_ACCEPTED_TERMS } from '../actions/ecom-context';

export const initialState: IEcomContext = {
    hasAcceptedTerms: false
};

export const reducer = (state: IEcomContext, action): IEcomContext => {
    switch (action.type) {
        case UPDATE_HAS_ACCEPTED_TERMS:
            return {
                ...state,
                hasAcceptedTerms: action.data.hasAcceptedTerms
            }

        default:
            return state;
    };
}