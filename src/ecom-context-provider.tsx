import React, { useReducer, useContext } from 'react';

import { reducer as customerReducer, initialState as customerInitialState } from './reducers/customer';
import { reducer as deliveryReducer, initialState as deliveryInitialState } from './reducers/delivery';
import { reducer as ecomContextReducer, initialState as ecomContextInitialState } from './reducers/ecom-context';
import { reducer as insuranceReducer, initialState as insuranceInitialState } from './reducers/insurance';
import { reducer as interactReducer, initialState as interactInitialState } from './reducers/interact';
import { reducer as paymentReducer, initialState as paymentInitialState } from './reducers/payment';
import { reducer as tradeInCarReducer, initialState as tradeInCarInitialState } from './reducers/trade-in-car';

import { ICustomerData, IDeliveryData, IEcomContext, IInsuranceData, IInteractData, IPaymentData, ITradeInCarData } from './types';

const initialState = {
    customer: { ...customerInitialState },
    delivery: { ...deliveryInitialState },
    ecomContext: { ...ecomContextInitialState },
    insurance: { ...insuranceInitialState },
    interact: { ...interactInitialState },
    payment: { ...paymentInitialState },
    tradeInCar: { ...tradeInCarInitialState }
};

const EcomContext = React.createContext(initialState);

export const EcomProvider = (props) => {
    const [ customerState, customerDispatch ] = useReducer(customerReducer, customerInitialState);
    const [ deliveryState, deliveryDispatch ] = useReducer(deliveryReducer, deliveryInitialState);
    const [ ecomContextState, ecomContextDispatch ] = useReducer(ecomContextReducer, ecomContextInitialState);
    const [ insuranceState, insuranceDispatch ] = useReducer(insuranceReducer, insuranceInitialState);
    const [ interactState, interactDispatch ] = useReducer(interactReducer, interactInitialState);
    const [ paymentState, paymentDispatch ] = useReducer(paymentReducer, paymentInitialState);
    const [ tradeInCarState, tradeInCarDispatch ] = useReducer(tradeInCarReducer, tradeInCarInitialState);

    const state = {
        customer: { ...customerState },
        delivery: { ...deliveryState },
        ecomContext: { ...ecomContextState },
        insurance: { ...insuranceState },
        interact: { ...interactState },
        payment:  { ...paymentState },
        tradeInCar: { ...tradeInCarState }
    };

    const dispatchAll: React.Dispatch<any> = (content) => {
        customerDispatch(content);
        deliveryDispatch(content);
        ecomContextDispatch(content);
        insuranceDispatch(content);
        interactDispatch(content);
        paymentDispatch(content);
        tradeInCarDispatch(content);
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

export const getDispatch = (): void => {
    const { dispatch } = useContext(EcomContext);
    return dispatch;
}

export const getCustomer = (): ICustomerData => {
    return getState().customer;
}

export const getDelivery = (): IDeliveryData => {
    return getState().delivery;
}

export const getEcomContext = (): IEcomContext => {
    return getState().ecomContext;
}

export const getInsurance = (): IInsuranceData => {
    return getState().insurance;
}

export const getInteract = (): IInteractData => {
    return getState().interact;
}

export const getPayment = (): IPaymentData => {
    return getState().payment;
}

export const getTradeInCar = (): ITradeInCarData => {
    return getState().tradeInCar;
}