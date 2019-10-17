import { PaymentType, IOrderOptionsResponse, IPaymentLookupResponse } from '@wayke-se/ecom';
import { ILoanInformation } from '../types';

export const getPaymentMethodTitle = (type: PaymentType) => {
    switch(type) {
        case PaymentType.Lease:
            return 'Privatleasing';
        case PaymentType.Loan:
            return 'Finansiering';
        case PaymentType.Cash:
            return 'Kontant';
        default:
            return '';
    }
};

const getLoanPaymentOptions = (orderOptions: IOrderOptionsResponse) => {
    if (!orderOptions) {
        return null;
    }

    return orderOptions.getPaymentOptions().find(p => p.type === PaymentType.Loan);
};

export const getLoanDetails = (orderOptions: IOrderOptionsResponse, paymentLookup: IPaymentLookupResponse | undefined): IPaymentLookupResponse => {
    return paymentLookup ? paymentLookup : getLoanPaymentOptions(orderOptions).loanDetails;
};

export const getLoanInformation = (orderOptions: IOrderOptionsResponse): ILoanInformation => {
    const loanPaymentOptions = getLoanPaymentOptions(orderOptions);

    if (loanPaymentOptions) {
        return {
            name: loanPaymentOptions.name,
            unit: loanPaymentOptions.unit
        };
    } else {
        return {
            name: '',
            unit: ''
        };
    }
};