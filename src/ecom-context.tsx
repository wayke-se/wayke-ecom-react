import React from "react";

import { IdentificationMethod, IEcomExternalProps, IEcomStore } from "./types";
import {
    IOrderOptionsResponse,
    IInsuranceOptionsResponse,
    IVehicleLookupResponse,
    IAddressLookupResponse,
    IPaymentLookupResponse,
    IBankIdAuthResponse,
    AuthMethod,
    IBankIdCollectResponse,
    ICreditAssessmentStatusResponse,
    ICreditAssessmentCase,
    ICreditAssessmentInquiry,
    ICreditAssessmentSignResponse,
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
    makeCreditAssessmentCreateCaseRequest,
    makeCreditAssessmentQrCodeSignRequest,
    makeCreditAssessmentSameDeviceSignRequest,
    makeCreditAssessmentCancelSigningRequest,
    makeCreditAssessmentGetStatusRequest,
    makeCreditAssessmentDeclineRequest,
} from "./tools/request-service";
import createCreditAssessmentInquiry from "./utils/credit-assessment/create-inquiry";
import { getLoanDetails } from "./utils/payment";
import getIdentificationMethod from "./utils/identification-method-resolver";

export interface IEcomContextProps extends IEcomExternalProps, IEcomStore {}

interface IState {
    isWaitingForResponse: boolean;

    orderOptions: IOrderOptionsResponse | null;
    insuranceOptions: IInsuranceOptionsResponse | null;
    vehicleLookup: IVehicleLookupResponse | null;
    addressLookup: IAddressLookupResponse | null;
    paymentLookup: IPaymentLookupResponse | null;
    bankIdAuth: IBankIdAuthResponse | null;
    pendingBankIdAuthRequest: boolean;
    bankIdCollect: IBankIdCollectResponse | null;
    hasBankIdError: boolean;
    hasCreditAssessmentError: boolean;
    pendingCreateCreditAssessmentCase: boolean;
    creditAssessmentCase: ICreditAssessmentCase | null;
    creditAssessmentStatus: ICreditAssessmentStatusResponse | null;
    creditAssessmentSigning: ICreditAssessmentSignResponse | null;
    pendingCreditAssessmentSignRequest: boolean;
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
        this.handleBankIdQrCodeAuth = this.handleBankIdQrCodeAuth.bind(this);
        this.handleBankIdSameDeviceAuth = this.handleBankIdSameDeviceAuth.bind(
            this
        );
        this.handleBankIdCollect = this.handleBankIdCollect.bind(this);
        this.handleBankIdCancel = this.handleBankIdCancel.bind(this);
        this.handleBankIdReset = this.handleBankIdReset.bind(this);

        this.createCreditAssessmentCase = this.createCreditAssessmentCase.bind(
            this
        );
        this.declineCreditAssessmentCase = this.declineCreditAssessmentCase.bind(
            this
        );
        this.signCreditAssessmentWithQrCode = this.signCreditAssessmentWithQrCode.bind(
            this
        );
        this.signCreditAssessmentWithSameDevice = this.signCreditAssessmentWithSameDevice.bind(
            this
        );
        this.cancelCreditAssessmentSigning = this.cancelCreditAssessmentSigning.bind(
            this
        );
        this.resetCreditAssessmentSigning = this.resetCreditAssessmentSigning.bind(
            this
        );
        this.getCreditAssessmentStatus = this.getCreditAssessmentStatus.bind(
            this
        );

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
            pendingBankIdAuthRequest: false,
            bankIdCollect: null,
            hasBankIdError: false,
            hasCreditAssessmentError: false,
            pendingCreateCreditAssessmentCase: false,
            creditAssessmentCase: null,
            creditAssessmentStatus: null,
            creditAssessmentSigning: null,
            pendingCreditAssessmentSignRequest: false,
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
        const { data } = this.props;
        const { orderOptions, addressLookup, bankIdCollect } = this.state;

        const identificationMethod = getIdentificationMethod(
            data,
            orderOptions
        );

        if (identificationMethod === IdentificationMethod.BankId) {
            return bankIdCollect.getAddress();
        }

        return !!addressLookup ? addressLookup.getAddress() : null;
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

    createCreditAssessmentCase() {
        const loanDetails = getLoanDetails(
            this.state.orderOptions,
            this.state.paymentLookup
        );

        let inquiry: ICreditAssessmentInquiry = null;
        try {
            inquiry = createCreditAssessmentInquiry(
                this.props.data,
                loanDetails
            );
        } catch (error) {
            if (error instanceof TypeError) {
                this.setState({
                    hasCreditAssessmentError: true,
                });
                return;
            }
        }

        const request = () => {
            makeCreditAssessmentCreateCaseRequest(inquiry, (response) => {
                const hasError = response instanceof Error;
                const creditAssessmentCase = !hasError ? response : null;

                this.saveResponse({
                    creditAssessmentCase,
                    creditAssessmentStatus: null,
                    pendingCreateCreditAssessmentCase: false,
                    hasCreditAssessmentError: hasError,
                });
            });
        };

        this.setState({
            hasCreditAssessmentError: false,
            pendingCreateCreditAssessmentCase: true,
        });
        this.makeRequest(request);
    }

    declineCreditAssessmentCase(callback: (response: boolean) => void) {
        const caseId = this.state.creditAssessmentCase.caseId;

        const request = () => {
            makeCreditAssessmentDeclineRequest(caseId, callback);
        };

        this.makeRequest(request);
    }

    signCreditAssessmentWithQrCode() {
        const caseId = this.state.creditAssessmentCase.caseId;

        const request = () => {
            makeCreditAssessmentQrCodeSignRequest(caseId, (response) => {
                const hasError = response instanceof Error;
                const creditAssessmentSigning = !hasError ? response : null;

                this.saveResponse({
                    creditAssessmentSigning,
                    creditAssessmentStatus: null,
                    pendingCreditAssessmentSignRequest: false,
                    hasCreditAssessmentError: hasError,
                });
            });
        };

        this.setState({
            hasCreditAssessmentError: false,
            pendingCreditAssessmentSignRequest: true,
        });
        this.makeRequest(request);
    }

    signCreditAssessmentWithSameDevice() {
        const caseId = this.state.creditAssessmentCase.caseId;

        const request = () => {
            makeCreditAssessmentSameDeviceSignRequest(caseId, (response) => {
                const hasError = response instanceof Error;
                const creditAssessmentSigning = !hasError ? response : null;

                this.saveResponse({
                    creditAssessmentSigning,
                    creditAssessmentStatus: null,
                    pendingCreditAssessmentSignRequest: false,
                    hasCreditAssessmentError: hasError,
                });
            });
        };

        this.setState({
            hasCreditAssessmentError: false,
            pendingCreditAssessmentSignRequest: true,
        });
        this.makeRequest(request);
    }

    cancelCreditAssessmentSigning(callback: (response: boolean) => void) {
        const { creditAssessmentSigning } = this.state;

        const noActiveSigning = !creditAssessmentSigning;
        if (noActiveSigning) {
            callback(false);
            return;
        }

        const request = () => {
            makeCreditAssessmentCancelSigningRequest(
                creditAssessmentSigning.getCaseId(),
                callback
            );
        };

        this.makeRequest(request);
    }

    resetCreditAssessmentSigning() {
        this.setState({
            hasCreditAssessmentError: false,
            creditAssessmentSigning: null,
        });
    }

    getCreditAssessmentStatus() {
        const { creditAssessmentCase } = this.state;

        const request = () => {
            makeCreditAssessmentGetStatusRequest(
                creditAssessmentCase.caseId,
                (response) => {
                    const hasError = response instanceof Error;
                    const creditAssessmentStatus = !hasError ? response : null;

                    this.saveResponse({
                        creditAssessmentStatus,
                        hasBankIdError: hasError,
                    });
                }
            );
        };

        this.setState({ hasCreditAssessmentError: false });
        this.makeRequest(request);
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
                createCreditAssessmentCase={this.createCreditAssessmentCase}
                declineCreditAssessmentCase={this.declineCreditAssessmentCase}
                signCreditAssessmentWithQrCode={
                    this.signCreditAssessmentWithQrCode
                }
                signCreditAssessmentWithSameDevice={
                    this.signCreditAssessmentWithSameDevice
                }
                cancelCreditAssessmentSigning={
                    this.cancelCreditAssessmentSigning
                }
                resetCreditAssessmentSigning={this.resetCreditAssessmentSigning}
                getCreditAssessmentStatus={this.getCreditAssessmentStatus}
                {...this.state}
                {...this.props}
            />
        );
    }
}

export default EcomContext;
