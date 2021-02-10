import { creditAssessment } from "@wayke-se/ecom";

export default (caseId: string, callback: (response: boolean) => void) => {
    creditAssessment
        .decline(caseId)
        .then(callback)
        .catch(() => callback(false));
};
