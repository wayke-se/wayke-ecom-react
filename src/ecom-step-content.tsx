import React from 'react';

import CustomerInformationDetails from './steps/customer-information-details';
import CustomerInformationInitial from './steps/customer-information-initial';
import FinalConfirmation from './steps/final-confirmation';
import InsuranceAlternativeChooser from './steps/insurance-alternative-chooser';
import InsuranceInformationDefinition from './steps/insurance-information-definition';
import PaymentFinancingDetails from './steps/payment-financing-details';
import PaymentMethodChooser from './steps/payment-method-chooser';
import TradeInCarDefinition from './steps/trade-in-car-definition';
import TradeInConfirmCar from './steps/trade-in-confirm-car';
import TradeInExistsChooser from './steps/trade-in-exists-chooser';

import EcomStep from './constants/ecom-step';
import { IEcomExternalProps, IEcomContext, IEcomLifecycle, IEcomStore } from './types';
import Alert from './components/alert';
import Spinner from './components/spinner';

interface AllProps extends IEcomExternalProps, IEcomContext, IEcomStore, IEcomLifecycle {
    step: EcomStep;
}

const EcomStepContent = (props: AllProps) => {
    if (!props.orderOptions && !props.isWaitingForResponse) {
        return <Alert message="Ett oväntat fel har uppstått. Prova igen senare." />;
    }

    switch (props.step) {
        case EcomStep.TRADE_IN_EXISTS_CHOOSER:
            return <TradeInExistsChooser {...props} />;

        case EcomStep.TRADE_IN_CAR_DEFINITION:
            return <TradeInCarDefinition {...props} />;

        case EcomStep.TRADE_IN_CONFIRM_CAR:
            return <TradeInConfirmCar {...props} />;

        case EcomStep.PAYMENT_METHOD_CHOOSER:
            return <PaymentMethodChooser {...props} />;

        case EcomStep.PAYMENT_FINANCING_DETAILS:
            return <PaymentFinancingDetails {...props} />;

        case EcomStep.INSURANCE_INFORMATION_DEFINITION:
            return <InsuranceInformationDefinition {...props} />;

        case EcomStep.INSURANCE_ALTERNATIVE_CHOOSER:
            return <InsuranceAlternativeChooser {...props} />;

        case EcomStep.CUSTOMER_INFORMATION_INITIAL:
            return <CustomerInformationInitial {...props} />;

        case EcomStep.CUSTOMER_INFORMATION_DETAILS:
            return <CustomerInformationDetails {...props} />;

        case EcomStep.FINAL_CONFIRMATION:
            return <FinalConfirmation {...props} />;

        default:
            if (props.isWaitingForResponse) {
                return <Spinner />;
            }

            return <div></div>;
    }
};

export default EcomStepContent;