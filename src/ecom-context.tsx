import React from "react";

import { IEcomExternalProps, IEcomStore } from "./types";
import {
    IOrderOptionsResponse,
    IInsuranceOptionsResponse,
    IVehicleLookupResponse,
    IAddressLookupResponse,
    IPaymentLookupResponse,
    IBankIdAuthResponse,
    AuthMethod,
    IBankIdCollectResponse,
} from "@wayke-se/ecom";

import EcomLifecycle from "./ecom-lifecycle";
import {
    makeOrderOptionsRequest,
    makeVehicleLookupRequest,
    makeInsuranceOptionsRequest,
    makeAddressLookupRequest,
    makeCreateOrderRequest,
    makePaymentLookupRequest,
    makeBankIdAuthRequest,
    makeBankIdCollectRequest,
    makeBankIdCancelRequest,
} from "./tools/request-service";
import { IDealerOption } from "@wayke-se/ecom/dist-types/orders/types";

export interface IEcomContextProps extends IEcomExternalProps, IEcomStore {}

interface IState {
    isWaitingForResponse: boolean;

    dealer?: string;
    orderOptions: IOrderOptionsResponse | null;
    insuranceOptions: IInsuranceOptionsResponse | null;
    vehicleLookup: IVehicleLookupResponse | null;
    addressLookup: IAddressLookupResponse | null;
    paymentLookup: IPaymentLookupResponse | null;
    bankIdAuth: IBankIdAuthResponse | null;
    pendingBankIdAuthRequest: boolean;
    bankIdCollect: IBankIdCollectResponse | null;
    hasBankIdError: boolean;
}

class EcomContext extends React.Component<IEcomContextProps, IState> {
    constructor(props: IEcomContextProps) {
        super(props);

        this.getAddress = this.getAddress.bind(this);
        this.handleDealerSelection = this.handleDealerSelection.bind(this);
        this.handleFetchVehicleInformation = this.handleFetchVehicleInformation.bind(
            this
        );
        this.handleFetchInsuranceOptions = this.handleFetchInsuranceOptions.bind(
            this
        );
        this.handleFetchAddressInformation = this.handleFetchAddressInformation.bind(
            this
        );
        this.handleFetchPaymentInformation = this.handleFetchPaymentInformation.bind(
            this
        );
        this.handleCreateOrder = this.handleCreateOrder.bind(this);
        this.handleBankIdQrCodeAuth = this.handleBankIdQrCodeAuth.bind(this);
        this.handleBankIdSameDeviceAuth = this.handleBankIdSameDeviceAuth.bind(
            this
        );
        this.handleBankIdCollect = this.handleBankIdCollect.bind(this);
        this.handleBankIdCancel = this.handleBankIdCancel.bind(this);
        this.handleBankIdReset = this.handleBankIdReset.bind(this);

        this.makeRequest = this.makeRequest.bind(this);
        this.saveResponse = this.saveResponse.bind(this);

        this.state = {
            isWaitingForResponse: false,

            dealer: props.dealer,
            orderOptions: null,
            insuranceOptions: null,
            vehicleLookup: null,
            addressLookup: null,
            paymentLookup: null,
            bankIdAuth: null,
            pendingBankIdAuthRequest: false,
            bankIdCollect: null,
            hasBankIdError: false,
        };
    }

    componentDidMount() {
        const request = () => {
            makeOrderOptionsRequest(
                {
                    vehicleId: this.props.vehicle.id,
                },
                (response: IOrderOptionsResponse | null) => {
                    this.saveResponse(
                        {
                            orderOptions: response,
                        },
                        () => ({})
                    );
                }
            );
        };

        this.makeRequest(request);
    }

    getAddress() {
        const { addressLookup, bankIdCollect } = this.state;
        const { useBankId } = this.props;

        if (useBankId) {
            return bankIdCollect.getAddress();
        }

        return !!addressLookup ? addressLookup.getAddress() : null;
    }

    handleDealerSelection(dealer: IDealerOption) {
        const request = () => {
            makeOrderOptionsRequest(
                {
                    vehicleId: this.props.vehicle.id,
                    dealerId: dealer.id,
                },
                (response: IOrderOptionsResponse | null) => {
                    this.saveResponse(
                        {
                            dealer: dealer.id,
                            orderOptions: response,
                        },
                        () => ({})
                    );
                }
            );
        };

        this.makeRequest(request);
    }

    handleFetchVehicleInformation(callback: (isSuccessful: boolean) => void) {
        const request = () => {
            makeVehicleLookupRequest(
                {
                    ecomData: this.props.data.tradeInCar,
                },
                (response: IVehicleLookupResponse | null) => {
                    this.saveResponse(
                        {
                            vehicleLookup: response,
                        },
                        () => {
                            callback(!!response);
                        }
                    );
                }
            );
        };

        this.makeRequest(request);
    }

    handleFetchInsuranceOptions(callback: (isSuccessful: boolean) => void) {
        const request = () => {
            makeInsuranceOptionsRequest(
                {
                    ecomData: this.props.data.insurance,
                    vehicleId: this.props.vehicle.id,
                    paymentType: this.props.data.payment.paymentType,
                },
                (response: IInsuranceOptionsResponse | null) => {
                    this.saveResponse(
                        {
                            insuranceOptions: response,
                        },
                        () => {
                            callback(!!response);
                        }
                    );
                }
            );
        };

        this.makeRequest(request);
    }

    handleFetchAddressInformation(callback: (isSuccessful: boolean) => void) {
        const request = () => {
            makeAddressLookupRequest(
                {
                    ecomData: this.props.data.customer,
                },
                (response: IAddressLookupResponse | null) => {
                    this.saveResponse(
                        {
                            addressLookup: response,
                        },
                        () => {
                            callback(!!response);
                        }
                    );
                }
            );
        };

        this.makeRequest(request);
    }

    handleFetchPaymentInformation(callback: (isSuccessful: boolean) => void) {
        const request = () => {
            makePaymentLookupRequest(
                {
                    dealerId: this.state.dealer,
                    vehicleId: this.props.vehicle.id,
                    ecomData: this.props.data.payment,
                    orderOptions: this.state.orderOptions,
                    paymentLookup: this.state.paymentLookup,
                },
                (response: IPaymentLookupResponse | null) => {
                    this.saveResponse(
                        {
                            paymentLookup: response,
                        },
                        () => {
                            callback(!!response);
                        }
                    );
                }
            );
        };

        this.makeRequest(request);
    }

    handleCreateOrder(callback: (isSuccessful: boolean) => void) {
        const request = () => {
            const address = this.getAddress();
            makeCreateOrderRequest(
                {
                    ecomData: this.props.data,
                    vehicleId: this.props.vehicle.id,
                    orderOptions: this.state.orderOptions,
                    paymentLookup: this.state.paymentLookup,
                    address,
                },
                (wasOrderCreated: boolean) => {
                    this.setState(
                        {
                            isWaitingForResponse: false,
                        },
                        () => {
                            callback(wasOrderCreated);
                        }
                    );
                }
            );
        };

        this.makeRequest(request);
    }

    handleBankIdQrCodeAuth() {
        const data = { method: AuthMethod.QrCode };

        const request = () => {
            makeBankIdAuthRequest(data, (response) => {
                const hasError = response instanceof Error;
                const bankIdAuth = !hasError ? response : null;

                this.saveResponse({
                    bankIdAuth,
                    bankIdCollect: null,
                    pendingBankIdAuthRequest: false,
                    hasBankIdError: hasError,
                });
            });
        };

        this.setState({
            hasBankIdError: false,
            pendingBankIdAuthRequest: true,
        });
        this.makeRequest(request);
    }

    handleBankIdSameDeviceAuth() {
        const data = { method: AuthMethod.SameDevice };

        const request = () => {
            makeBankIdAuthRequest(data, (response) => {
                const hasError = response instanceof Error;
                const bankIdAuth = !hasError ? response : null;

                this.saveResponse({
                    bankIdAuth,
                    bankIdCollect: null,
                    pendingBankIdAuthRequest: false,
                    hasBankIdError: hasError,
                });
            });
        };

        this.setState({
            hasBankIdError: false,
            pendingBankIdAuthRequest: true,
        });
        this.makeRequest(request);
    }

    handleBankIdCollect() {
        const { bankIdAuth } = this.state;
        const noActiveBankIdProcess = !bankIdAuth;
        if (noActiveBankIdProcess) {
            return;
        }

        const data = {
            method: bankIdAuth.getMethod(),
            orderRef: bankIdAuth.getOrderRef(),
        };

        const request = () => {
            makeBankIdCollectRequest(data, (response) => {
                const hasError = response instanceof Error;
                const bankIdCollect = !hasError ? response : null;

                this.saveResponse({
                    bankIdCollect,
                    hasBankIdError: hasError,
                });
            });
        };

        this.setState({ hasBankIdError: false });
        this.makeRequest(request);
    }

    handleBankIdCancel(callback: (response: boolean) => void) {
        const { bankIdAuth } = this.state;

        const noActiveBankIdProcess = !bankIdAuth;
        if (noActiveBankIdProcess) {
            callback(false);
            return;
        }

        const data = {
            orderRef: bankIdAuth.getOrderRef(),
        };

        const request = () => {
            makeBankIdCancelRequest(data, callback);
        };

        this.makeRequest(request);
    }

    handleBankIdReset() {
        this.setState({
            hasBankIdError: false,
            bankIdAuth: null,
        });
    }

    makeRequest(callback: () => void) {
        this.setState(
            {
                isWaitingForResponse: true,
            },
            callback
        );
    }

    saveResponse(responseState: any, callback?: () => void) {
        this.setState(
            {
                ...responseState,
                isWaitingForResponse: false,
            },
            callback
        );
    }

    render() {
        return (
            <EcomLifecycle
                getAddress={this.getAddress}
                onHandleDealerSelection={this.handleDealerSelection}
                onFetchInsuranceOptions={this.handleFetchInsuranceOptions}
                onFetchVehicleInformation={this.handleFetchVehicleInformation}
                onFetchAddressInformation={this.handleFetchAddressInformation}
                onFetchPaymentInformation={this.handleFetchPaymentInformation}
                onCreateOrder={this.handleCreateOrder}
                onBankIdQrCodeAuth={this.handleBankIdQrCodeAuth}
                onBankIdSameDeviceAuth={this.handleBankIdSameDeviceAuth}
                onBankIdCollect={this.handleBankIdCollect}
                onBankIdReset={this.handleBankIdReset}
                onBankIdCancel={this.handleBankIdCancel}
                {...this.state}
                {...this.props}
            />
        );
    }
}

export default EcomContext;
