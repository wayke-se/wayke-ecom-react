import React from 'react';

import EcomLifecycle from './ecom-lifecycle';
import { IVehicle, IEcomData } from './types';

import StoreAction from './enums/store-action';
import { IOrderOptionsResponse } from 'wayke-ecom';

interface IEcomStoreProps {
    options: IOrderOptionsResponse | undefined;
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
                hasAcceptedTerms: false,
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
            insurance: {
                insuranceOption: null,
                personalNumber: '',
                expectedDrivingDistance: null,
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

                customer: {
                    hasAcceptedTerms: false,
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
                paymentOption: null,
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

    dispatchStoreAction(key: StoreAction, value: any, callback?: () => void) {
        let stateUpdate = null;

        switch (key) {
            case StoreAction.UPDATE_NAMED_VALUE:
                const namedValueType = value.type;
                const namedValueName = value.name;
                const namedValueValue = value.value;

                const oldContent = this.state[namedValueType];

                stateUpdate = {
                    [namedValueType]: {
                        ...oldContent,
                        [namedValueName]: namedValueValue
                    }
                };
                break;

            case StoreAction.CUSTOMER_UPDATE_PERSONAL_NUMBER:
                stateUpdate = {
                    customer: {
                        personalNumber: value
                    }
                };
                break;

            case StoreAction.INTERACT_SET_ALL_FOR_TYPE:
                const newInteract = {};
                const keys = Object.keys(this.state.interact[value]);

                keys.forEach(key => {
                    newInteract[key] = true;
                });

                stateUpdate = {
                    interact: {
                        ...this.state.interact,
                        [value]: {
                            ...newInteract
                        }
                    }
                };
                break;

            case StoreAction.INTERACT_UPDATE_SPECIFIC:
                const interactType = value.type;
                const interactName = value.name;

                stateUpdate = {
                    interact: {
                        ...this.state.interact,
                        [interactType]: {
                            ...this.state.interact[interactType],
                            [interactName]: true
                        }
                    }
                };
                break;

            case StoreAction.TRADE_IN_CAR_UPDATE_HAS_TRADE_IN_CAR:
                stateUpdate = {
                    tradeInCar: {
                        ...this.state.tradeInCar,
                        hasTradeInCar: value
                    }
                };
                break;

            case StoreAction.PAYMENT_UPDATE_FINANCING_INFORMATION:
                stateUpdate = {
                    payment: {
                        ...this.state.payment,
                        ...value
                    }
                };
                break;
        };

        if (stateUpdate && callback) {
            this.setState(stateUpdate, callback);
        } else if (stateUpdate) {
            this.setState(stateUpdate);
        }
    }

    render() {
        return (
            <EcomLifecycle
                    {...this.props}
                    data={this.state}
                    dispatchStoreAction={this.dispatchStoreAction} />
        );
    }
};

export default EcomStore;