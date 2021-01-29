import { IOrderOptionsResponse, PaymentType } from "@wayke-se/ecom";
import { IEcomData } from "../types";

const creditAssessmentIsSupported = (options: IOrderOptionsResponse) => {
    const loan = options
        .getPaymentOptions()
        .find((option) => option.type === PaymentType.Loan);

    if (!!loan) {
        return loan.loanDetails.shouldUseCreditScoring();
    }
    return false;
};

export const shouldUseCreditAssessment = (
    data: IEcomData,
    options: IOrderOptionsResponse
) => {
    const paymentIsLoan =
        !!data.payment && data.payment.paymentType === PaymentType.Loan;
    if (!paymentIsLoan) {
        return false;
    }

    const isSupported = creditAssessmentIsSupported(options);
    if (isSupported) {
        return true;
    }

    return false;
};
