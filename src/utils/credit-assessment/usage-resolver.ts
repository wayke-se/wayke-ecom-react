import { IOrderOptionsResponse, PaymentType } from "@wayke-se/ecom";
import { IEcomData } from "../../types";

const creditAssessmentIsSupported = (options: IOrderOptionsResponse) => {
    const loan = options
        .getPaymentOptions()
        .find((option) => option.type === PaymentType.Loan);

    if (!!loan) {
        return loan.loanDetails.shouldUseCreditScoring();
    }
    return false;
};

const shouldUseCreditAssessment = (
    data: IEcomData,
    options: IOrderOptionsResponse
) => {
    if (!data.useBankId) {
        return false;
    }

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

export default shouldUseCreditAssessment;
