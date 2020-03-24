import React from "react";

import EcomContext from "./ecom-context";
import { IEcomExternalProps, IEcomData } from "./types";

import StoreAction from "./constants/store-action";

class EcomStore extends React.Component<IEcomExternalProps, IEcomData> {
    constructor(props: IEcomExternalProps) {
        super(props);

        this.dispatchStoreAction = this.dispatchStoreAction.bind(this);

        this.state = {
            customer: {
                hasAcceptedConditions: false,
                hasAcceptedReturnConditions: false,
                inputType: null,
                personalNumber: null,
                name: "",
                address: "",
                zip: "",
                city: "",
                email: "",
                phone: "",
            },
            insurance: {
                personalNumber: "",
                expectedDrivingDistance: null,
                hasAddedInsurance: false,
                wantsToSeeInsuranceOptions: null,
                addons: [],
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
                    hasAcceptedConditions: false,
                    hasAcceptedReturnConditions: false,
                    personalNumber: false,
                    name: false,
                    address: false,
                    zip: false,
                    city: false,
                    email: false,
                    phone: false,
                },
            },
            payment: {
                paymentType: null,
                loanDeposit: null,
                loanDuration: null,
                loanResidual: null,
                hasAcceptedLoanDetails: false,
            },
            tradeInCar: {
                wantsToDefineTradeIn: false,
                hasProvidedTradeInInfo: false,
                hasProvidedTradeInCondition: false,
                hasTradeInCar: false,
                registrationNumber: "",
                milage: "",
                condition: undefined,
                description: "",
            },
        };
    }

    dispatchStoreAction(
        key: StoreAction,
        value: any,
        callback?: (state: IEcomData) => void
    ) {
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
                        [namedValueName]: namedValueValue,
                    },
                };
                break;

            case StoreAction.INTERACT_SET_ALL_FOR_TYPE:
                const newInteract = {};
                const stateKeys = Object.keys(this.state.interact[value]);

                stateKeys.forEach(stateKey => {
                    newInteract[stateKey] = true;
                });

                stateUpdate = {
                    interact: {
                        ...this.state.interact,
                        [value]: {
                            ...newInteract,
                        },
                    },
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
                            [interactName]: true,
                        },
                    },
                };
                break;

            case StoreAction.PAYMENT_UPDATE_FINANCING_INFORMATION:
                stateUpdate = {
                    payment: {
                        ...this.state.payment,
                        ...value,
                    },
                };
                break;
        }

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
                dispatchStoreAction={this.dispatchStoreAction}
            />
        );
    }
}

export default EcomStore;
