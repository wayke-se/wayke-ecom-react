import React, { useReducer, useContext } from 'react';

import { reducer as customerReducer, initialState as customerInitialState } from './reducers/customer';
import { ICustomerData } from './types';

const initialState = {
    customer: { ...customerInitialState }
};

const EcomContext = React.createContext(initialState);

export const EcomProvider = (props) => {
    const [ customerState, customerDispatch ] = useReducer(customerReducer, customerInitialState);

    const state = {
        customer: { ...customerState }
    };

    const dispatchAll: React.Dispatch<any> = (content) => {
        customerDispatch(content);
    };

    return (
        <EcomContext.Provider value={{ state, dispatch: dispatchAll }}>
            {props.children}
        </EcomContext.Provider>
    );
}

const getState = () => {
    const { state } = useContext(EcomContext);

    return state;
}

export const getCustomer = (): ICustomerData => {
    return getState().customer;
}

export const getDispatch = (): void => {
    const { dispatch } = useContext(EcomContext);
    return dispatch;
}