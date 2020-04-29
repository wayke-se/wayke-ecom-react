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
    bankIdCollect: IBankIdCollectResponse | null;
    ipAddress: string;
}

class EcomContext extends React.Component<IEcomContextProps, IState> {
    constructor(props: IEcomContextProps) {
        super(props);

        this.getAddress = this.getAddress.bind(this);
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
        this.handleIpAddressLookup = this.handleIpAddressLookup.bind(this);
        this.handleBankIdQrCodeAuth = this.handleBankIdQrCodeAuth.bind(this);
        this.handleBankIdSameDeviceAuth = this.handleBankIdSameDeviceAuth.bind(
            this
        );
        this.handleBankIdCollect = this.handleBankIdCollect.bind(this);
        this.handleBankIdReset = this.handleBankIdReset.bind(this);

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
            bankIdCollect: null,
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

    getAddress() {
        const { addressLookup, bankIdCollect } = this.state;
        return !!bankIdCollect
            ? bankIdCollect.getAddress()
            : addressLookup.getAddress();
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

    handleBankIdSameDeviceAuth(
        callback: (response: IBankIdAuthResponse) => void
    ) {
        const { ipAddress } = this.state;
        const data = {
            method: AuthMethod.SameDevice,
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

    handleBankIdCollect(callback: (response: IBankIdCollectResponse) => void) {
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
            makeBankIdCollectRequest(data, response => {
                this.saveResponse(
                    {
                        bankIdCollect: response,
                    },
                    () => {
                        callback(response);
                    }
                );
            });
        };

        this.makeRequest(request);
    }

    handleBankIdReset() {
        this.setState({
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
                getAddress={this.getAddress}
                onFetchInsuranceOptions={this.handleFetchInsuranceOptions}
                onFetchVehicleInformation={this.handleFetchVehicleInformation}
                onFetchAddressInformation={this.handleFetchAddressInformation}
                onFetchPaymentInformation={this.handleFetchPaymentInformation}
                onCreateOrder={this.handleCreateOrder}
                onLookupIpAddress={this.handleIpAddressLookup}
                onBankIdQrCodeAuth={this.handleBankIdQrCodeAuth}
                onBankIdSameDeviceAuth={this.handleBankIdSameDeviceAuth}
                onBankIdCollect={this.handleBankIdCollect}
                onBankIdSuccess={this.handleBankIdReset}
                hasIpAddress={!!this.state.ipAddress}
                {...this.state}
                {...this.props}
            />
        );
    }
}

export default EcomContext;
