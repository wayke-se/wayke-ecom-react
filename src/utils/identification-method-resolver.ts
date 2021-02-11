import { IOrderOptionsResponse } from "@wayke-se/ecom";
import { IdentificationMethod, IEcomData } from "../types";

import shouldUseCreditAssessment from "./credit-assessment/usage-resolver";

const getIdentificationMethod = (
    data: IEcomData,
    options: IOrderOptionsResponse
): IdentificationMethod => {
    if (!data || !data.useBankId) {
        return IdentificationMethod.Manual;
    }

    let useCreditAssessment = false;
    if (!!options) {
        useCreditAssessment = shouldUseCreditAssessment(data, options);
    }

    if (useCreditAssessment) {
        return IdentificationMethod.CreditAssessment;
    }
    return IdentificationMethod.BankId;
};

export default getIdentificationMethod;
