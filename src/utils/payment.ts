import { PaymentType } from 'wayke-ecom';

export const getPaymentMethodTitle = (type: PaymentType) => {
    switch(type) {
        case PaymentType.Lease:
            return 'Privatleasing';
        case PaymentType.Loan:
            return 'Financiering';
        case PaymentType.Cash:
            return 'Kontant';
        default:
            return '';
    }
}