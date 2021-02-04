import {
    ICreditAssessmentInquiry,
    IPaymentLookupResponse,
} from "@wayke-se/ecom";

import { IEcomData } from "../../types";
import createTerm from "./create-term";
import { asEmployment, asMaritalStatus } from "./enums";
import { formatPersonalNumber } from "./formatting";

const createInquiry = (
    data: IEcomData,
    loan: IPaymentLookupResponse
): ICreditAssessmentInquiry => {
    const formattedPersonalNumber = formatPersonalNumber(
        data.customer.personalNumber
    );
    const term = createTerm(loan.getDurationSpec().current);

    const inquiry = {
        externalId: data.payment.externalId,
        customer: {
            socialId: formattedPersonalNumber,
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
            term,
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
