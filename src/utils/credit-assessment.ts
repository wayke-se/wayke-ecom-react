import {
    Employment,
    IOrderOptionsResponse,
    MaritalStatus,
    PaymentType,
} from "@wayke-se/ecom";
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

export const asMaritalStatus = (value: string) => {
    switch (value) {
        case "Gift":
            return MaritalStatus.Married;
        default:
            return MaritalStatus.Single;
    }
};

export const asEmployment = (value: string) => {
    switch (value) {
        case "Fulltidsanställd":
            return Employment.FullTimeEmployed;
        case "Student":
            return Employment.Student;
        case "Deltidsanställd":
            return Employment.TemporarilyEmployed;
        case "Pensionär":
            return Employment.Retired;
        case "Egenföretagare":
            return Employment.SelfEmployed;
        default:
            return Employment.Other;
    }
};
