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
} from "./tools/request-service";
import lookupIpAddress from "./tools/ip-service";

export interface IEcomContextProps extends IEcomExternalProps, IEcomStore {}

interface IState {
    isWaitingForResponse: boolean;

    orderOptions: IOrderOptionsResponse | null;
    insuranceOptions: IInsuranceOptionsResponse | null;
    vehicleLookup: IVehicleLookupResponse | null;
    addressLookup: IAddressLookupResponse | null;
    paymentLookup: IPaymentLookupResponse | null;
    bankIdAuth: IBankIdAuthResponse | null;
    ipAddress: string;
}

class EcomContext extends React.Component<IEcomContextProps, IState> {
    constructor(props: IEcomContextProps) {
        super(props);

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
        this.handleIpAddressLookup = this.handleIpAddressLookup.bind(this);

        this.makeRequest = this.makeRequest.bind(this);
        this.saveResponse = this.saveResponse.bind(this);

        this.state = {
            isWaitingForResponse: false,

            orderOptions: null,
            insuranceOptions: null,
            vehicleLookup: null,
            addressLookup: null,
            paymentLookup: null,
            bankIdAuth: null,
            ipAddress: "",
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
            makeCreateOrderRequest(
                {
                    ecomData: this.props.data,
                    addressLookup: this.state.addressLookup,
                    vehicleId: this.props.vehicle.id,
                    orderOptions: this.state.orderOptions,
                    paymentLookup: this.state.paymentLookup,
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

    handleBankIdQrCodeAuth(callback: (response: IBankIdAuthResponse) => void) {
        const { ipAddress } = this.state;
        const data = {
            method: AuthMethod.QrCode,
            ipAddress,
        };

        const request = () => {
            makeBankIdAuthRequest(data, response => {
                this.saveResponse(
                    {
                        bankIdAuth: response,
                    },
                    () => {
                        callback(response);
                    }
                );
            });
        };

        this.makeRequest(request);
    }

    handleIpAddressLookup() {
        lookupIpAddress().then(response => {
            const { ip } = response;
            this.saveResponse(
                {
                    ipAddress: ip,
                },
                () => {}
            );
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

    saveResponse(responseState: any, callback: () => void) {
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
                onFetchInsuranceOptions={this.handleFetchInsuranceOptions}
                onFetchVehicleInformation={this.handleFetchVehicleInformation}
                onFetchAddressInformation={this.handleFetchAddressInformation}
                onFetchPaymentInformation={this.handleFetchPaymentInformation}
                onCreateOrder={this.handleCreateOrder}
                onBankIdQrCodeAuth={this.handleBankIdQrCodeAuth}
                onLookupIpAddress={this.handleIpAddressLookup}
                hasIpAddress={!!this.state.ipAddress}
                {...this.state}
                {...this.props}
            />
        );
    }
}

export default EcomContext;
