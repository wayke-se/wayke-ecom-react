import {
    creditAssessment,
    ICreditAssessmentStatusResponse,
} from "@wayke-se/ecom";

export default (
    caseId: string,
    callback: (response: ICreditAssessmentStatusResponse | Error | null) => void
) => {
    creditAssessment.getStatus(caseId).then(callback).catch(callback);
};
