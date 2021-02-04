import {
    ICreditAssessmentInquiry,
    IPaymentLookupResponse,
} from "@wayke-se/ecom";

import { IEcomData } from "../../types";
import { asEmployment, asMaritalStatus } from "./enums";

const createInquiry = (
    data: IEcomData,
    loan: IPaymentLookupResponse
): ICreditAssessmentInquiry => {
    const inquiry = {
        externalId: data.payment.externalId,
        customer: {
            socialId: data.customer.personalNumber,
            email: data.customer.email,
            phone: data.customer.phone,
        },
        loan: {
            financialProductId: loan.getFinancialProductCode(),
            price: loan.getCreditAmount(),
            downPayment: loan.getDownPaymentSpec().current,
            credit: loan.getPrice(),
            interestRate: loan.getInterests().interest,
            monthlyCost: loan.getCosts().monthlyCost,
        },
        householdEconomy: {
            maritalStatus: asMaritalStatus(data.householdEconomy.maritalStatus),
            income: parseInt(data.householdEconomy.income, 10),
            employment: asEmployment(data.householdEconomy.employment),
            householdChildren: parseInt(
                data.householdEconomy.householdChildren,
                10
            ),
            householdIncome: parseInt(
                data.householdEconomy.householdIncome,
                10
            ),
            householdHousingCost: parseInt(
                data.householdEconomy.householdHousingCost,
                10
            ),
            householdDebt: parseInt(data.householdEconomy.householdDebt, 10),
        },
    };
    return inquiry;
};

export default createInquiry;
