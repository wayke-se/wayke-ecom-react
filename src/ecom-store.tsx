import React from 'react';

import EcomLifecycle from './ecom-lifecycle';
import { IVehicle, IEcomData } from './types';

import StoreAction from './enums/store-action';

interface IEcomStoreProps {
    vehicle: IVehicle;
};

interface IState extends IEcomData {
};

class EcomStore extends React.Component<IEcomStoreProps, IState> {
    constructor(props: IEcomStoreProps) {
        super(props);

        this.dispatchStoreAction = this.dispatchStoreAction.bind(this);

        this.state = {
            customer: {
                inputType: null,
                personalNumber: '',
                name: '',
                adress: '',
                zip: '',
                city: '',
                email: '',
                phone: ''
            },
            delivery: {
                type: null
            },
            ecomContext: {
                hasAcceptedTerms: false
            },
            insurance: {
                insuranceOption: null,
                personalNumber: '',
                expectedDrivingDistance: {
                    min: null,
                    max: null
                },
                alternative: ''
            },
            interact: {
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
            },
            payment: {
                method: null,
                financingDownPayment: '',
                financingDuration: null
            },
            tradeInCar: {
                hasTradeInCar: null,
                registrationNumber: '',
                milage: ''
            }
        };
    }

    dispatchStoreAction(key: StoreAction, value: any) {
        switch (key) {
            case StoreAction.CUSTOMER_UPDATE_PERSONAL_NUMBER:
                // @ts-ignore
                return this.setState({ customer: { personalNumber: value }});

            case StoreAction.INTERACT_SET_ALL_FOR_TYPE:
                const newInteract = {};
                const keys = Object.keys(this.state.interact[value]);

                keys.forEach(key => {
                    newInteract[key] = true;
                });

                // @ts-ignore
                return this.setState({ interact: { newInteract }});

            case StoreAction.INTERACT_UPDATE_SPECIFIC:
                return this.setState({ interact: value });

            case StoreAction.TRADE_IN_UPDATE_HAS_TRADE_IN_CAR:
                // @ts-ignore
                return this.setState({
                    tradeInCar: {
                        ...this.state.tradeInCar,
                        hasTradeInCar: value
                    }
                });

            default:
                return;
        };
    }

    render() {
        return (
            <EcomLifecycle
                    vehicle={this.props.vehicle}
                    data={this.state}
                    dispatchStoreAction={this.dispatchStoreAction} />
        );
    }
};

export default EcomStore;