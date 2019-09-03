import React from 'react';

import EcomContext from './ecom-context';
import { IEcomExternalProps, IEcomData, ILoanSpecification } from './types';

import StoreAction from './constants/store-action';

interface IEcomStoreProps extends IEcomExternalProps {
    loanSpecification: ILoanSpecification;
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
                personalNumber: null,
                name: '',
                address: '',
                zip: '',
                city: '',
                email: '',
                phone: ''
            },
            insurance: {
                personalNumber: '',
                expectedDrivingDistance: null,
                hasAddedInsurance: false,
                wantsToSeeInsuranceOptions: null,
                addons: []
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
                    address: false,
                    zip: false,
                    city: false,
                    email: false,
                    phone: false,
                }
            },
            payment: {
                paymentType: null,
                loanDeposit: null,
                loanDuration: null,
                loanResidual: null
            },
            tradeInCar: {
                hasTradeInCar: null,
                registrationNumber: '',
                milage: ''
            }
        };
    }

    dispatchStoreAction(key: StoreAction, value: any, callback?: (state : IEcomData) => void) {
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
            this.setState(stateUpdate, () => {
                callback(this.state);
            });
        } else if (stateUpdate) {
            this.setState(stateUpdate);
        }
    }

    render() {
        return (
            <EcomContext
                    {...this.props}
                    data={this.state}
                    dispatchStoreAction={this.dispatchStoreAction} />
        );
    }
};

export default EcomStore;