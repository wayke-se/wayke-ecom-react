import { PaymentType, IOrderOptionsResponse } from 'wayke-ecom';

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
}

export const getLoanPaymentOptions = (orderOptions: IOrderOptionsResponse) => {
    if (!orderOptions) {
        return null;
    }

    return orderOptions.getPaymentOptions().find(p => p.type === PaymentType.Loan);
}